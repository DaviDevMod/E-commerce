import { getSession } from 'next-auth/client';
import { compare } from 'bcryptjs';

import { connectToDb } from '../../../lib/db';

async function handler(req, res) {

  const method = req.method;

  if (method !== 'PATCH' && method !== 'POST') {
    res.status(501).json({ error: { message: "The request is not supported by the server and cannot be handled." } });
    return;
  }

  // it's the `sendBeacon()` in `Layout.js` that needs `JSON.parse()`
  const body = req.body && (method !== 'POST' || req.body.notABeacon ? req.body : JSON.parse(req.body));

  const session = await getSession({ req });

  if (!body.password && !session) {
    res.status(403).json({ error: { message: "The server is refusing to give the requested resource." } });
    return;
  }

  const client = await connectToDb();

  if (!client) {
    res.status(500).json({ error: { message: "The server couldn't fulfill the request. Please try again." } });
    return;
  }

  const usersClollection = client.db().collection('users');

  const user = await usersClollection.findOne({ email: body.email });

  if (!user) {
    // maybe 403 would be more appropriate, since this should only happen when someone
    // tries to access the cart of some random account, which turns out doesn't exist
    res.status(404).json({ error: { message: 'We cannot find an account with your email address.' } });
    return;
  }

  const authorized = body.password ?
    await compare(body.password, user.password) :
    session?.user?.cartId === user.cartId;

  if (!authorized) {
    res.status(403).json({ error: { message: "The server is refusing to give the requested resource." } });
    return;
  }

  // POST requests (except sendBeacon)
  // used in place of GET requests for security reasons (attach password to requests)
  if (method === 'POST' && body.notABeacon) {
    res.status(200).json(user.cart);
    return;
  }

  // PATCH requests (plus sendBeacon)
  const update = await usersClollection.updateOne({ email: body.email }, { $set: { cart: body.cart } });
  if (!update.result.ok) res.status(500).json({ error: { message: "The cart failed to reach our database." } });
  else res.status(200).json({});
}

export default handler;