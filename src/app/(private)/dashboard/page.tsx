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
    <div>
      Private Dashboard <br /> <button onClick={handleSignOut}>Logout</button>
    </div>
  );
}
