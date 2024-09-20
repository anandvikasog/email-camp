import { paths } from '@/paths';
import { redirect } from 'next/navigation';
import React from 'react';
import { Metadata } from 'next';
import { config } from '@/config';
import { verifyEmail } from '@/lib/actions/auth';
import Link from 'next/link';
import Image from 'next/image';
import { MdKeyboardArrowRight } from 'react-icons/md';

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
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="flex flex-col items-center justify-center space-y-6 w-[30vw] p-4">
          <Image
            src="/images/tick.png"
            alt="Lock Icon"
            height={100}
            width={100}
          />
          <h1 className="text-2xl font-bold">Email verified</h1>

          <Link
            href={paths.common.home}
            className="text-gray-600 hover:underline text-xs flex items-center"
          >
            <span className="text-xl">Continue</span>
            <MdKeyboardArrowRight className="text-2xl" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
