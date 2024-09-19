import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { paths } from '@/paths';
import { socialLoginUser } from '../actions/auth';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: paths.public.signIn,
    error: paths.common.error,
  },
  secret: process.env.JWT_KEY,
  providers: [
    CredentialsProvider({
      // @ts-ignore
      authorize: async (credentials: { data: any }) => {
        if (credentials?.data) {
          return JSON.parse(credentials.data);
        }
        throw new Error(
          `Login failed: Some error occurred while creating the session.`
        );
      },
    }),
  ],

  callbacks: {
    // @ts-ignore
    session: ({ token }) => {
      return token;
    },
    jwt: async ({ token, user, account }) => {
      const email = user?.email;
      const provider = account?.provider;
      if (email && provider && ['google', 'facebook'].includes(provider)) {
        let loginResponse: any = await socialLoginUser({
          email,
          provider,
        });
        loginResponse = JSON.parse(loginResponse);

        if (loginResponse.status) {
          return {
            ...token,
            ...{ token: loginResponse.token, ...loginResponse.data },
          };
        }
      }

      return { ...token, ...user };
    },
  },
};
