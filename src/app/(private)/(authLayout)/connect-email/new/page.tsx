'use client';
import SpinnerLoader from '@/components/common/spinner-loader';
import { connectEmailSchema } from '@/lib/validationSchema';
import { paths } from '@/paths';
import { useConnectEmailMutation } from '@/store/Features/auth/authApiSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z as zod } from 'zod';

type ProviderType = 'gmail' | 'outlook' | 'custom';

const providerDomainMap = {
  gmail: ['gmail.com'],
  outlook: ['outlook.com'],
  custom: [],
};

type Values = zod.infer<typeof connectEmailSchema>;

const defaultValues = {
  email: '',
  signature: '',
};

const Page = () => {
  const router = useRouter();
  const [connect, { data, isLoading }] = useConnectEmailMutation<any>();
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(connectEmailSchema),
  });
  const handleSelectProvider = (provider: ProviderType) => {
    setValue('domainType', provider);
  };

  const onSubmit = (data: Values) => {
    const { email, signature, domainType } = data;

    if (!domainType || !providerDomainMap[domainType]) {
      setError('email', {
        type: 'custom',
        message: 'Please select provider first',
      });
      return;
    }

    const emailDomain: string = email.split('@')[1];

    if (domainType !== 'custom') {
      const allowedDomains = providerDomainMap[domainType];
      if (!emailDomain || !allowedDomains.includes(emailDomain)) {
        setError('email', {
          type: 'custom',
          message: `Please provide a ${domainType} email.`,
        });
        return;
      }
    }

    connect({
      email,
      signature, // New field for signature or details
      domain: emailDomain,
    });
  };

  useEffect(() => {
    if (data) {
      toast.success(data.message);
      router.push(paths.private.connectedEmails);
    }
  }, [data, router]);

  const activeProvider = watch('domainType');

  return (
    <div className="p-10">
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
      <div className="pb-10">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          Choose your email provider
        </h1>
        <div className="flex flex-wrap gap-5 pt-5">
          <div
            className={`flex justify-center items-center gap-3 font-thin text-black py-3 rounded-lg border p-10 cursor-pointer ${activeProvider === 'gmail' ? 'border-[#6950e9] bg-[#dbdbdb]' : 'border-gray-500'}`}
            onClick={() => handleSelectProvider('gmail')}
          >
            <Image
              src="/images/google-icon.png"
              alt="gmail"
              height={20}
              width={20}
            />
            Google/Gmail
          </div>
          <div
            className={`flex justify-center items-center gap-3 font-thin text-black py-3 rounded-lg border p-10 cursor-pointer ${activeProvider === 'outlook' ? 'border-[#6950e9] bg-[#dbdbdb]' : 'border-gray-500'}`}
            onClick={() => handleSelectProvider('outlook')}
          >
            <Image
              src="/images/microsoft-icon.png"
              alt="gmail"
              height={20}
              width={20}
            />
            Microsoft/Outlook
          </div>
          <div
            className={`flex justify-center items-center gap-3 font-thin text-black py-3 rounded-lg border p-10 cursor-pointer ${activeProvider === 'custom' ? 'border-[#6950e9] bg-[#dbdbdb]' : 'border-gray-500'}`}
            onClick={() => handleSelectProvider('custom')}
          >
            <Image
              src="/images/email-icon.png"
              alt="gmail"
              height={20}
              width={20}
            />
            Custom Email
          </div>
        </div>
      </div>
      {activeProvider && (
        <div>
          <div className="flex flex-col gap-5 max-w-[500px]">
            <input
              type="email"
              {...register('email')}
              placeholder="Enter email address"
              className={`p-2 border rounded bg-white`}
            />
            {errors['email'] && (
              <span className="text-xs text-red-600">
                {errors['email']?.message}
              </span>
            )}

            {/* Textarea for the signature or additional details */}
            <textarea
              {...register('signature')}
              placeholder="Signature text"
              className="p-2 border rounded bg-white"
              rows={5}
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
              {isLoading ? <SpinnerLoader /> : 'Connect'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
