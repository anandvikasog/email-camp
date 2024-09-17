import AddAuthData from '@/components/auth/auth-store';
import { verifySession } from '@/lib/actions/auth';
import { authOptions } from '@/lib/nextAuth/authOptions';
import { paths } from '@/paths';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  // console.log("has session ===", session)
  if (!session) {
    redirect(paths.public.signIn);
  }

  let verifySessionRes: any = await verifySession();

  verifySessionRes = JSON.parse(verifySessionRes);
  if (!verifySessionRes.status) {
    redirect(paths.public.signIn);
  }

  return (
    <>
      <AddAuthData userData={verifySessionRes.data} />
      {children}
    </>
  );
}
