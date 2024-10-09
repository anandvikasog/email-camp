'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import Image from 'next/image';
import Link from 'next/link';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { changePasswordSchema } from '@/lib/validationSchema';
import { useChangePasswordMutation } from '@/store/Features/auth/authApiSlice';
import { logOut } from '@/store/Features/auth/authSlice';
import { signOut } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import SpinnerLoader from '../common/spinner-loader';

type Values = zod.infer<typeof changePasswordSchema>;

const defaultValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
} satisfies Values;

export function ChangePasswordForm() {
  const [changePassword, { data, isLoading }] =
    useChangePasswordMutation<any>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(changePasswordSchema),
  });

  const handleSignOut = async () => {
    dispatch(logOut());
    await signOut({ redirect: true, callbackUrl: paths.public.signIn });
  };

  const onSubmit = async (data: Values) => {
    try {
      const response = await changePassword(data).unwrap();

      toast.success('Password changed successfully');
      // Delay the redirect to give time for the toast to appear
      setTimeout(() => {
        handleSignOut();
        router.push(paths.public.signIn);
      }, 2000);
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const fields = [
    {
      id: 'oldPassword',
      placeholder: 'Old Password',
      error: errors.oldPassword?.message,
    },
    {
      id: 'newPassword',
      placeholder: 'New Password',
      error: errors.newPassword?.message,
    },
    {
      id: 'confirmPassword',
      placeholder: 'Confirm Password',
      error: errors.confirmPassword?.message,
    },
  ];

  return (
    <div>
      <div
        className={`flex items-center justify-center  h-screen ${isDarkMode ? 'bg-[#202938] text-white' : 'bg-white text-black'}`}
      >
        <div className="flex flex-col items-center justify-center space-y-6 max-sm:w-[60vw] w-[30vw] max-sm:p-1 p-4">
          <Image
            src="/images/lock-icon.svg"
            alt="Lock Icon"
            height={225}
            width={225}
          />
          <h1 className="text-2xl font-bold">Change your password</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            {fields.map(({ id, placeholder, error }) => (
              <div key={id} className="space-y-2">
                <input
                  id={id}
                  type="password"
                  {...register(id as keyof Values)}
                  placeholder={placeholder}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode ? 'bg-[#202938] border-[#111828]' : 'bg-white'
                  }`}
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-[#6950e9] text-white py-3 rounded-lg font-semibold transition duration-300"
            >
              {isLoading ? <SpinnerLoader /> : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
