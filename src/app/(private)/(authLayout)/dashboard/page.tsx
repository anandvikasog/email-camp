'use client';

import * as React from 'react';
// import type { Metadata } from "next";
// import { config } from '@/config';
import { useDispatch } from 'react-redux';
import { logOut } from '@/store/Features/auth/authSlice';
import { signOut } from 'next-auth/react';
import { paths } from '@/paths';
import Link from 'next/link';

// export const metadata = {
//   title: `Dashboard | ${config.site.name}`,
// } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    dispatch(logOut());
    await signOut({ redirect: true, callbackUrl: paths.public.signIn });
  };

  return (
    <div className="flex justify-center pt-5 min-h-[calc(100vh-5rem)]">
      <div className="flex flex-col gap-y-4 w-[500px]">
        <div>Dashboard</div>
        <Link
          className="w-full py-2 px-4 bg-[blue] text-white rounded text-center"
          href={paths.private.account}
        >
          Go to Account
        </Link>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#6950e9] text-white rounded"
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
