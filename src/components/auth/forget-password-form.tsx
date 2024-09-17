'use client';

import React, { useState, useEffect, JSX } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { useForgetPasswordMutation } from '@/store/Features/auth/authApiSlice';
import { forgetPasswordSchema } from '@/lib/validationSchema';
import Link from 'next/link';

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
        <div>Password reset link is sent on {targetEmail}</div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
              required
            />
            <button disabled={isLoading} type="submit">
              Send recovery link
            </button>
            <div>
              <Link href={paths.public.signIn}>Login instead</Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
