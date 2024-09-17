import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import type { NextAuthOptions } from 'next-auth';
import { paths } from '@/paths';
import { socialLoginUser } from '../actions/auth';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: paths.public.signIn,
    error: paths.common.error,
  },
  secret: process.env.NEXT_PUBLIC_JWT_KEY,
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
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET as string,
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
