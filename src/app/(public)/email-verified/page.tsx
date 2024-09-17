import { paths } from '@/paths';
import { redirect } from 'next/navigation';
import React from 'react';
import { Metadata } from 'next';
import { config } from '@/config';
import { verifyEmail } from '@/lib/actions/auth';
import Link from 'next/link';

export const metadata = {
  title: `Email verified | ${config.site.name}`,
} satisfies Metadata;

const EmailVerified = async ({
  searchParams,
}: {
  searchParams: { code: string };
}) => {
  if (!searchParams?.code) {
    redirect(paths.common.home);
  }

  let verifyResponse: any = await verifyEmail({ code: searchParams.code });
  verifyResponse = JSON.parse(verifyResponse);
  if (!verifyResponse.status) {
    redirect(paths.common.home);
  }

  return (
    <div>
      <p>Email verified successfully.</p>
      <Link href={paths.public.signIn}>Login</Link>
    </div>
  );
};

export default EmailVerified;
