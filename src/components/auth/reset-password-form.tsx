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

type Values = zod.infer<typeof resetPasswordSchema>;

const defaultValues = { password: '' } satisfies Values;

export function ResetPasswordForm({ token }: { token: string }) {
  const [resetPassword, { data, isLoading }] = useResetPasswordMutation<any>();
  const router = useRouter();
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        id="password"
        type="password"
        {...register('password')}
        placeholder="New Password"
        className="w-full p-2 border rounded"
        required
      />
      <button disabled={isLoading} type="submit">
        Submit
      </button>
    </form>
  );
}
