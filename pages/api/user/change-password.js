import { getSession } from 'next-auth/client';
import { hash, compare } from 'bcryptjs';

import { connectToDb } from '../../../lib/db';

async function handler(req, res) {

  if (req.method !== 'PATCH') {
    res.status(501).json({ error: { message: "The request is not supported by the server and cannot be handled." } });
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ error: { message: 'Not authenticated!' } });
    return;
  }

  if (req.body.oldPassword?.length < 6) {
    res.status(422).json({ error: { message: 'The old password is wrong.' } });
    return;
  }

  if (req.body.newPassword?.length < 6) {
    res.status(422).json({ error: { message: 'Your password must be at least six characters.' } });
    return;
  }

  const client = await connectToDb();

  if (!client) {
    res.status(500).json({ error: { message: "The server couldn't fulfill the request. Please try again." } });
    return;
  }

  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: session.user.email });

  if (!user) {
    res.status(500).json({ error: { message: "The server couldn't fulfill the request. Please try again." } });
    return;
  }

  const theyMatch = await compare(req.body.oldPassword, user.password);

  if (!theyMatch) {
    res.status(422).json({ error: { message: 'The old password is wrong.' } });
    return;
  }

  const newPassHashed = await hash(req.body.newPassword, 12);

  await usersCollection.updateOne({ email: session.user.email }, { $set: { password: newPassHashed } });

  res.status(200).json({ message: 'Password Updated!' });
}

export default handler;