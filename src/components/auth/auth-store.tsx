'use client';

import { paths } from '@/paths';
import { logIn } from '@/store/Features/auth/authSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const AddAuthData = ({ userData }: { userData: any }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(logIn(userData));
    if (!userData?.subscription) {
      router.push(paths.private.payment);
    }
  }, [userData, dispatch, router]);
  return <></>;
};

export default AddAuthData;
