'use client';

import * as React from 'react';
// import type { Metadata } from "next";
// import { config } from '@/config';
import { useDispatch } from 'react-redux';
import { logOut } from '@/store/Features/auth/authSlice';
import { signOut } from 'next-auth/react';
import { paths } from '@/paths';

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
    <div className="flex justify-center mt-5">
      <div className="flex flex-col gap-y-4 w-[500px]">
        <div>Dashboard</div>

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
