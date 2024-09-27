import AddAuthData from '@/components/auth/auth-store';
import EmailVerifyAlert from '@/components/private/email-verify-alert';
import { verifySession } from '@/lib/actions/auth';
import { authOptions } from '@/lib/nextAuth/authOptions';
import { paths } from '@/paths';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Layout from '@/components/private/layout';
import React from 'react';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Layout>
        <EmailVerifyAlert />
        {children}
      </Layout>
    </>
  );
}
