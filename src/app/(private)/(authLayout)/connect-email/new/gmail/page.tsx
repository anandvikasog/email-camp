'use client';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import React from 'react';
import ConnectGmailButton from '@/components/private/connect-gmail';

const Page = () => {
  const router = useRouter();

  return (
    <div className="p-2 min-h-screen">
      <div className="pb-2">
        <button
          className="flex items-center gap-2 text-indigo-600 hover:underline"
          onClick={() => router.push(paths.private.connectNewEmails)}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" />
          </svg>
          Back
        </button>
      </div>
      <div className="pb-10">
        <div className="flex flex-wrap gap-5 pt-5">
          <ConnectGmailButton />
        </div>
      </div>
    </div>
  );
};

export default Page;
