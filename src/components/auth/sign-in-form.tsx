'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLoginUserMutation } from '@/store/Features/auth/authApiSlice';
import { signInSchema } from '@/lib/validationSchema';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Link from 'next/link';
import { signInCardData } from './data';

import { AuthSidePanel } from './auth-left-panel';
import SpinnerLoader from '../common/spinner-loader';
import { ToggleButton } from '../common/toggle-button';

type Values = zod.infer<typeof signInSchema>;

const defaultValues = {
  email: '',
  password: '',
} satisfies Values;

export function SignInForm(): React.JSX.Element {
  const [loginUser, { data, isLoading }] = useLoginUserMutation<any>();
  const router = useRouter();
  const { handleSubmit, register } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(signInSchema),
  });
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const onSubmit = async (data: Values) => {
    loginUser(data);
  };

  useEffect(() => {
    if (data) {
      const { token, data: userData } = data;
      try {
        const result: any = signIn('credentials', {
          redirect: true,
          callbackUrl: paths.private.dashboard,
          data: JSON.stringify({ token, ...userData }),
        });
        if (result.error) {
          toast.error(result.error);
          return;
        }
      } catch (error) {
        toast.error('Something went wrong');
      }
    }
  }, [data, router]);

  return (
    <div className="flex flex-row">
      <AuthSidePanel {...signInCardData} />
      <div
        className={`w-[50vw] h-screen relative flex items-center justify-center ${
          isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
        }`}
      >
        <div className="w-3/5">
          {/* <ToggleButton isChecked={isDarkMode} onChange={toggleDarkMode} /> */}

          <div className="py-4">
            <h3 className="text-2xl font-semibold py-2">Sign In</h3>
            <span className="text-xs text-gray-400">New user?</span>
            <Link
              className="text-[#6950e9] cursor-pointer text-xs"
              href={paths.public.signUp}
            >
              Create an Account
            </Link>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <h2 className="font-bold">Register with your email id</h2>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className={`w-full p-2 border rounded-lg ${
                isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'
              }`}
              required
            />

            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className={`w-full p-2 border rounded-lg ${
                isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'
              }`}
              required
            />
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center ">
                <input type="checkbox" />
                <span className="ml-2 text-sm text-gray-600">Remember Me?</span>
              </label>
              <Link
                href={paths.public.forgetPassword}
                className="text-sm text-[#f26387] hover:underline"
              >
                Forget Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#6950e9] text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? <SpinnerLoader /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
