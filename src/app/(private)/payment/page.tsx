'use client';

import { paths } from '@/paths';
import { logOut } from '@/store/Features/auth/authSlice';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import { useDispatch } from 'react-redux';

const Payment = () => {
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    dispatch(logOut());
    await signOut({ redirect: true, callbackUrl: paths.public.signIn });
  };
  return (
    <div className="flex justify-center mt-5">
      <div className="flex flex-col gap-y-4 w-[500px]">
        <div>Do payment here (comming soon ...)</div>
        <div>
          <Image
            src="/images/checkout.png"
            height={500}
            width={500}
            alt="checkout"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#6950e9] text-white rounded"
          onClick={() => {
            alert('Comming soon');
          }}
        >
          Pay
        </button>
        <button
          type="submit"
          className="max-w-[100px] py-2 px-4 bg-[#6950e9] text-white rounded"
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Payment;
