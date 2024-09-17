'use client';

import React, { useEffect, useState, JSX } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z as zod } from 'zod';
import { useCreateUserMutation } from '@/store/Features/auth/authApiSlice';
import { useDarkMode } from '../../contexts/DarkModeContext';

import { signUpSchema } from '@/lib/validationSchema';
import Link from 'next/link';
import { paths } from '@/paths';
import { signUpCardData } from './data';

import { AuthSidePanel } from './auth-left-panel';
import SpinnerLoader from '../common/spinner-loader';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';

type Values = zod.infer<typeof signUpSchema>;

const defaultValues = {
  firstName: '',
  lastName: '', // Optional
  email: '',
  password: '',
  mobile: '', // Optional
  profilePicture: null as unknown as File,
} satisfies Values;

export function SignUpForm(): JSX.Element {
  const router = useRouter();

  const [createUser, { data, isLoading }] = useCreateUserMutation<any>();
  const {
    control,
    handleSubmit,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(signUpSchema) });
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const onSubmit = async (data: Values) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('profilePicture', data.profilePicture);
    if (data.lastName) {
      formData.append('lastName', data.lastName);
    }
    if (data.mobile) {
      formData.append('mobile', data.mobile);
    }
    createUser(formData);
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

  const fields = [
    {
      id: 'firstName',
      type: 'text',
      placeholder: 'First Name',
      required: true,
    },
    { id: 'lastName', type: 'text', placeholder: 'Last Name', required: false },
    {
      id: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      id: 'password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
    },
    {
      id: 'mobile',
      type: 'tel',
      placeholder: 'Mobile Number',
      required: false,
    },
    {
      id: 'profilePicture',
      type: 'file',
      placeholder: 'Upload Profile Picture',
      required: true,
    },
  ];

  return (
    <div>
      <div className="flex flex-row ">
        <AuthSidePanel {...signUpCardData} />

        <div
          className={`w-[50vw] h-screen relative flex items-center justify-center ${
            isDarkMode ? 'bg-[#111828] text-white' : 'bg-white text-black'
          }`}
        >
          <div className="w-3/5">
            <label
              htmlFor="darkModeToggle"
              className="flex items-center cursor-pointer absolute top-2 right-2"
            >
              <span
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ${
                  isDarkMode ? 'bg-[#6950e9]' : ''
                }`}
              >
                <span
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </span>
              <input
                type="checkbox"
                id="darkModeToggle"
                className="sr-only"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
            </label>

            <div className="py-4">
              <h3 className="text-2xl font-semibold py-2">
                Sign up for 14 days free trial
              </h3>
              <span className="text-xs text-gray-500">
                Already have an account?
              </span>
              <Link
                className="text-[#6950e9] cursor-pointer text-xs"
                href={paths.public.signIn}
              >
                Sign In
              </Link>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-4"
            >
              <h2 className="font-bold">Register with your email id</h2>

              {/* {fields.map(({ id, type, placeholder, required }) => (
                    <div key={id}>
                      {type === 'file' ? (
                        <input
                          id={id}
                          type={type}
                          placeholder={placeholder}
                          onChange={handleFileChange}
                          className={`w-full p-2 border rounded ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
                          required={required}
                        />
                      ) : (
                        <input
                          id={id}
                          type={type}
                          {...register(id as keyof Values)}
                          placeholder={placeholder}
                          className={`w-full p-2 border rounded ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
                          required={required}
                        />
                      )}
                      {errors[id as keyof Values] && (
                        <span className="text-xs text-red-600">
                          {errors[id as keyof Values]?.message}
                        </span>
                      )}
                    </div>
                  ))} */}

              {fields.map(({ id, type, placeholder, required }) => (
                <div key={id}>
                  {type === 'file' ? (
                    <Controller
                      name={id as keyof Values}
                      control={control}
                      render={({ field }) => (
                        <input
                          id={id}
                          type={type}
                          placeholder={placeholder}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setValue('profilePicture', file);
                              trigger('profilePicture');
                            }
                          }}
                          className={`w-full p-2 border rounded-lg ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
                          required={required}
                        />
                      )}
                    />
                  ) : (
                    <input
                      id={id}
                      type={type}
                      {...register(id as keyof Values)}
                      placeholder={placeholder}
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
                      required={required}
                    />
                  )}
                  {errors[id as keyof Values] && (
                    <span className="text-xs text-red-600">
                      {errors[id as keyof Values]?.message}
                    </span>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#6950e9] text-white rounded"
              >
                {isLoading ? <SpinnerLoader /> : 'Sign up via Email'}
              </button>
              <p className="text-gray-500 text-xs">
                <span>By signing up, you agree </span>{' '}
                <Link href="/" className="text-[#6950e9] hover:underline">
                  Terms of Service
                </Link>{' '}
                <span>
                  & your consent to receiving email communications from sales
                  handy.
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
