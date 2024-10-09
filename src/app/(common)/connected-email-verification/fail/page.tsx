import { paths } from '@/paths';
import React from 'react';
import { Metadata } from 'next';
import { config } from '@/config';
import Link from 'next/link';
import Image from 'next/image';
import { MdKeyboardArrowRight } from 'react-icons/md';

export const metadata = {
  title: `Email not verified | ${config.site.name}`,
} satisfies Metadata;

const EmailVerified = async () => {
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="flex flex-col items-center justify-center space-y-6 w-[30vw] p-4">
          <Image
            src="/images/cross.png"
            alt="Lock Icon"
            height={100}
            width={100}
          />
          <h1 className="text-2xl font-bold">Email not verified</h1>

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
