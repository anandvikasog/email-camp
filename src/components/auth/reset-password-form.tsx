'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useResetPasswordMutation } from '@/store/Features/auth/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { resetPasswordSchema } from '@/lib/validationSchema';
import SpinnerLoader from '../common/spinner-loader';
import { useDarkMode } from '@/contexts/DarkModeContext';
import Link from 'next/link';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import Image from 'next/image';

type Values = zod.infer<typeof resetPasswordSchema>;

const defaultValues = { password: '' } satisfies Values;

export function ResetPasswordForm({ token }: { token: string }) {
  const [resetPassword, { data, isLoading }] = useResetPasswordMutation<any>();
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { handleSubmit, register } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: Values) => {
    resetPassword({ ...data, token });
  };

  useEffect(() => {
    if (data) {
      toast.success(data.message);
      router.push(paths.public.signIn);
    }
  }, [data, router]);

  return (
    <div>
      <div
        className={`flex items-center justify-center h-screen ${
          isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-6 w-[30vw] p-4">
          <Image src="/lock-icon.png" alt="Lock Icon" height={20} width={20} />
          <h1 className="text-2xl font-bold">Reset your password?</h1>
          <p className="text-gray-600 text-center">
            Please enter new password.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="New Password"
              required
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode ? 'bg-[#202938] border-[#111828]' : 'bg-white'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6950e9] text-white py-3 rounded-lg font-semibold transition duration-300"
            >
              {isLoading ? <SpinnerLoader /> : 'Submit'}
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
    </div>
  );
}
