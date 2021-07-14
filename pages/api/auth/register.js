import { hash } from 'bcryptjs';

import { connectToDb } from '../../../lib/db';

async function handler(req, res) {

  const { email, password } = req.body;

  const client = await connectToDb();

  if (!client) {
    res.status(500).json({ error: { message: "The server couldn't fulfill the request. Please try again." } });
    return;
  }

  const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (!emailRegExp.test(email)) {
    res.status(422).json({ error: { message: 'The email address is invalid' } });
    return;
  }

  if (password.length < 6) {
    res.status(422).json({ error: { message: 'The password must be at least six characters' } });
    return;
  }

  const usersClollection = client.db().collection('users');

  if (await usersClollection.countDocuments({ email }, { limit: 1 })) {
    res.status(422).json({ error: { message: 'An account already exists with that e-mail address.' } });
  }
  else {
    const hashedPassword = await hash(password, 12);
    if (await usersClollection.insertOne({
      email,
      password: hashedPassword,
      cart: { items: [], quantity: 0, total: 0, },
      cartId: Math.random().toString(36).slice(2),
    })) res.status(201).json({});
    else res.status(500).json({ error: { message: "We were unable to store the credentials. Please try again." } });
  }
}

export default handler;