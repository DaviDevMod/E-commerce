import { compare } from 'bcryptjs';

import { connectToDb } from '../../../lib/db';

async function handler(req, res) {

  if (req.method !== 'POST') {
    res.status(501).json({ error: { message: "The request is not supported by the server and cannot be handled." } });
    return;
  }

  const client = await connectToDb();

  if (!client) {
    res.status(500).json({ error: { message: "The server couldn't fulfill the request. Please try again." } });
    return;
  }

  const usersCollection = client.db().collection('users');

  const objWithPassword = await usersCollection.findOne({ email: req.body.email }, { projection: { _id: 0, password: 1 } });

  if (!objWithPassword) {
    res.status(422).json({ error: { message: 'We cannot find an account with that email address.' } });
    return;
  }

  const theyMatch = await compare(req.body.password, objWithPassword.password);

  if (!theyMatch) {
    res.status(422).json({ error: { message: 'Your password is incorrect.' } });
    return;
  }

  res.status(200).json({});
}

export default handler;

