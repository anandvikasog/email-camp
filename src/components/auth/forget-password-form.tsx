'use client';

import React, { useState, useEffect, JSX } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { useForgetPasswordMutation } from '@/store/Features/auth/authApiSlice';
import { forgetPasswordSchema } from '@/lib/validationSchema';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Link from 'next/link';
import SpinnerLoader from '../common/spinner-loader';
import Image from 'next/image';

type Values = zod.infer<typeof forgetPasswordSchema>;

const defaultValues = { email: '' } satisfies Values;

export function ForgetPasswordForm(): JSX.Element {
  const [linkSent, setLinkSent] = useState<boolean>(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [forgetPassword, { data, isLoading }] =
    useForgetPasswordMutation<any>();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(forgetPasswordSchema),
  });

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const onSubmit = async (data: Values) => {
    forgetPassword(data);
  };

  useEffect(() => {
    if (data) {
      setTargetEmail(data.email);
      setLinkSent(true);
    }
  }, [data]);

  return (
    <div>
      {linkSent ? (
        <div
          className={`flex items-center justify-center h-screen ${
            isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-6 lg:w-[30vw] p-4">
            <Image
              src="/images/lock-icon.png"
              alt="Lock Icon"
              height={100}
              width={100}
            />
            <h1 className="text-2xl font-bold">
              Forget Password reset link is sent
            </h1>
            <p className="text-gray-600 text-center">{targetEmail}</p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`flex items-center justify-center h-screen ${
              isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-6 lg:w-[30vw] p-4">
              <Image
                src="/images/lock-icon.svg"
                alt="Lock Icon"
                height={225}
                width={225}
              />
              <h1 className="text-lg sm:text-2xl font-semibold">
                Forgot your password?
              </h1>
              <p className="text-gray-600 text-center max-sm:text-xs">
                Please enter the email address associated with your account and
                we will email you a link to reset your password.
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode ? 'bg-[#202938] border-[#111828]' : 'bg-white'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#6950e9] text-white py-3 rounded-lg font-semibold transition duration-300"
                >
                  {isLoading ? <SpinnerLoader /> : 'Send Link'}
                </button>
              </form>
              <Link
                href={paths.public.signIn}
                className="text-gray-600 hover:underline text-xs flex items-center"
              >
                <MdKeyboardArrowLeft className="text-2xl" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
