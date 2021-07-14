import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { compare } from 'bcryptjs';

import { connectToDb } from '../../../lib/db';

export default NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    jwt: true,
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {

        const client = await connectToDb();

        if (!client) throw new Error('The server could not fulfill the request. Please try again.');

        const usersCollection = client.db().collection('users');

        const email = credentials.email;

        const user = await usersCollection.findOne({ email });

        if (!user) throw new Error('We cannot find an account with that email address.');

        const theyMatch = await compare(credentials.password, user.password);

        if (!theyMatch) throw new Error('Your password is incorrect.');

        return { email, cartId: user.cartId };
      }
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) token.user = user;
      return token;
    },
    async session(session, token) {
      session.user = token.user;
      return session;
    },
    async redirect(url, baseUrl) {
      return url.includes('http') ? baseUrl : baseUrl + url;
    },
  },
});