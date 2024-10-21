'use client';

import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { zodResolver } from '@hookform/resolvers/zod';
import { connectEmailSchema } from '@/lib/validationSchema';
import SpinnerLoader from '@/components/common/spinner-loader';
import {
  useConnectCustomMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '@/store/Features/auth/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../../../../contexts/DarkModeContext';

type Values = zod.infer<typeof connectEmailSchema>;

const defaultValues = {
  email: '',
  smtpHost: '',
  smtpPort: '',
  smtpUsername: '',
  smtpPassword: '',
  imapHost: '',
  imapPort: '',
  imapUsername: '',
  imapPassword: '',
};

const CustomEmailForm = () => {
  const router = useRouter();
  const [connectCustom, { data, isLoading }] = useConnectCustomMutation<any>();
  const [sendOtpMutation, { isLoading: isSendingOtp }] = useSendOtpMutation(); // API to send OTP
  const [verifyOtpMutation, { isLoading: isVerifyingOtp }] =
    useVerifyOtpMutation(); // API to verify OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const { isDarkMode } = useDarkMode();

  // Step 1: Handle sending OTP
  const sendOtp = async (email: string) => {
    try {
      await sendOtpMutation({ email }).unwrap();
      setOtpSent(true);
      toast.success('OTP sent to your email.');
    } catch (err) {
      toast.error('Failed to send OTP.');
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async (otp: string, email: string) => {
    try {
      await verifyOtpMutation({ email, otp }).unwrap();
      setOtpVerified(true);
      toast.success('OTP verified successfully.');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Error verifying OTP.');
    }
  };

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(connectEmailSchema),
  });

  const onSubmit = (data: Values) => {
    if (!otpVerified) {
      toast.error('Please verify OTP before proceeding.');
      return;
    }
    const {
      email,
      smtpHost,
      smtpPort,
      smtpUsername,
      imapHost,
      imapPort,
      imapUsername,
      smtpPassword,
      imapPassword,
    } = data;

    connectCustom({
      email,
      smtpHost,
      smtpPort,
      smtpUsername,
      imapHost,
      imapPort,
      imapUsername,
      smtpPassword,
      imapPassword,
    });
  };

  useEffect(() => {
    if (data) {
      toast.success(data.message);

      router.push(paths.private.editConnectedEmail(data.data._id));
    }
  }, [data, router]);

  return (
    <div className="p-2 min-h-screen">
      <div className="pb-2">
        <button
          className="flex items-center gap-2 text-[#6950e9] hover:underline"
          onClick={() => router.push(paths.private.connectNewEmails)}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" />
          </svg>
          Back
        </button>
      </div>
      <div className="pb-10">
        <div className="flex flex-col gap-5 pt-5 sm:px-10 max-w-xl">
          <input
            type="email"
            {...register('email')}
            placeholder="Enter email address"
            className={`p-2 border rounded ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
          />
          {errors['email'] && (
            <span className="text-xs text-red-600">
              {errors['email']?.message}
            </span>
          )}
          {otpSent && !otpVerified && (
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                className={`p-2 border rounded ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={() => verifyOtp(otp, getValues('email'))}
                disabled={isVerifyingOtp}
                className="mt-2 bg-[#6950e9] text-white py-2 px-4 rounded"
              >
                {isVerifyingOtp ? <SpinnerLoader /> : 'Verify OTP'}
              </button>
            </div>
          )}

          {otpVerified && ( // Display verification success message
            <div className="text-[#6950e9] font-semibold">
              OTP Verified Successfully!
            </div>
          )}

          {!otpSent && !otpVerified && (
            <button
              type="button"
              onClick={() => sendOtp(getValues('email'))}
              disabled={isSendingOtp}
              className="bg-[#6950e9] text-white py-2 px-4 rounded"
            >
              {isSendingOtp ? <SpinnerLoader /> : 'Send OTP'}
            </button>
          )}

          <div className="border p-5 rounded-lg shadow-md">
            <h2 className="font-semibold text-base mb-2">SMTP Server Data</h2>

            <input
              type="text"
              {...register('smtpHost')}
              placeholder="SMTP Host..."
              className={`p-2 border rounded w-full ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
            />
            {errors['smtpHost'] && (
              <span className="text-xs text-red-600">
                {errors['smtpHost']?.message}
              </span>
            )}

            <input
              type="number"
              {...register('smtpPort')}
              placeholder="Port..."
              className={`p-2 border rounded w-full mt-3 ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
            />
            {errors['smtpPort'] && (
              <span className="text-xs text-red-600">
                {errors['smtpPort']?.message}
              </span>
            )}

            <input
              type="text"
              {...register('smtpUsername')}
              placeholder="Username..."
              className={`p-2 border rounded w-full mt-3 ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
            />
            {errors['smtpUsername'] && (
              <span className="text-xs text-red-600">
                {errors['smtpUsername']?.message}
              </span>
            )}

            <input
              type="password"
              {...register('smtpPassword')}
              placeholder="Password..."
              className={`p-2 border rounded w-full mt-3 ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
            />
            {errors['smtpPassword'] && (
              <span className="text-xs text-red-600">
                {errors['smtpPassword']?.message}
              </span>
            )}
          </div>

          <div className="border p-5 rounded-lg shadow-md mt-5">
            <h2 className="font-semibold text-base mb-2">IMAP Server Data</h2>

            <input
              type="text"
              {...register('imapHost')}
              placeholder="IMAP Host..."
              className={`p-2 border rounded w-full ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
            />
            {errors['imapHost'] && (
              <span className="text-xs text-red-600">
                {errors['imapHost']?.message}
              </span>
            )}

            <input
              type="number"
              {...register('imapPort')}
              placeholder="Port..."
              className={`p-2 border rounded w-full mt-3 ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
            />
            {errors['imapPort'] && (
              <span className="text-xs text-red-600">
                {errors['imapPort']?.message}
              </span>
            )}

            <input
              type="text"
              {...register('imapUsername')}
              placeholder="Username..."
              className={`p-2 border rounded w-full mt-3 ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
            />
            {errors['imapUsername'] && (
              <span className="text-xs text-red-600">
                {errors['imapUsername']?.message}
              </span>
            )}

            <input
              type="password"
              {...register('imapPassword')}
              placeholder="Password..."
              className={`p-2 border rounded w-full mt-3 ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
            />
            {errors['imapPassword'] && (
              <span className="text-xs text-red-600">
                {errors['imapPassword']?.message}
              </span>
            )}
          </div>

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
    </div>
  );
};

export default CustomEmailForm;
