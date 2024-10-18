'use client';
import dynamic from 'next/dynamic';
import SpinnerLoader from '@/components/common/spinner-loader';
import { updateEmailSchema } from '@/lib/validationSchema';
import { paths } from '@/paths';
import { useUpdateConnectedEmailMutation } from '@/store/Features/auth/authApiSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z as zod } from 'zod';
import { useDarkMode } from '../../../../../contexts/DarkModeContext';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = dynamic(() => import('react-quill'), { ssr: false });

type Values = zod.infer<typeof updateEmailSchema>;

const defaultValues = {
  signature: '',
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: connectEmailId } = useParams();

  // Retrieve the signature from the URL query parameters
  const signatureParam = searchParams.get('signature');
  const [updateConnectedEmail, { isLoading, isSuccess, isError, data }] =
    useUpdateConnectedEmailMutation();
  console.log(data, JSON.stringify(data));
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(updateEmailSchema),
  });

  const { isDarkMode } = useDarkMode();

  // Set the pre-filled signature when the component mounts
  useEffect(() => {
    if (signatureParam) {
      setValue('signature', signatureParam);
    }
  }, [signatureParam, setValue]);

  const onSubmit = async (data: Values) => {
    const payload = {
      id: connectEmailId, // Replace with actual email id
      signature: data.signature,
    };

    try {
      await updateConnectedEmail(payload).unwrap();
    } catch (error) {
      console.error('Failed to update signature:', error);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success('Signature Updated Successfully');
      // Delay the redirect to give time for the toast to appear
      setTimeout(() => {
        router.push(paths.private.connectedEmails);
      }, 2000);
    } else if (isError) {
      toast.error('Failed to update signature.');
    }
  }, [isSuccess, isError, data, router]);

  return (
    <div className="p-10 min-h-[calc(100vh-5rem)]">
      <div className="pb-10">
        <button
          className="flex items-center gap-2 text-indigo-600 hover:underline"
          onClick={() => router.push(paths.private.connectedEmails)}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" />
          </svg>
          Back
        </button>
      </div>

      <div className="flex flex-col gap-5 max-w-[500px]">
        {/* Textarea for the signature or additional details */}
        <RichTextEditor
          theme="snow"
          value={watch('signature')}
          onChange={(value) => setValue('signature', value)}
          className={`rounded ${isDarkMode ? 'bg-[#202938]' : 'bg-white'}`}
        />
        {errors['signature'] && (
          <span className="text-xs text-red-600">
            {errors['signature']?.message}
          </span>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#6950e9] text-white py-3 rounded-lg font-semibold transition duration-300"
          onClick={handleSubmit(onSubmit)}
        >
          {isLoading ? <SpinnerLoader /> : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Page;
