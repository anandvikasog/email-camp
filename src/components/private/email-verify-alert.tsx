'use client';

import { RootState } from '@/store/store';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/20/solid';
import { useResendVerifyEmailMutation } from '@/store/Features/auth/authApiSlice';
import SpinnerLoader from '../common/spinner-loader';
import Image from 'next/image';

const skippedPaths = ['/payment'];

const EmailVerifyAlert = () => {
  const { emailVerified, _id } = useSelector((store: RootState) => store.auth);
  const [showAlert, setShowAlert] = useState(false);
  const pathName = usePathname();
  const [linkResent, seLinkResent] = useState(false);
  const [resenderifyEmail, { data, isLoading }] =
    useResendVerifyEmailMutation<any>();

  const onClickResend = () => {
    resenderifyEmail({ userId: _id });
  };

  useEffect(() => {
    if (skippedPaths.includes(pathName)) {
      setShowAlert(false);
      return;
    }
    if (emailVerified !== null) {
      setShowAlert(!emailVerified);
    }
  }, [pathName, emailVerified]);

  useEffect(() => {
    if (data) {
      seLinkResent(true);
    }
  }, [data]);

  return (
    <div id="alert-box">
      {showAlert ? (
        <div className="max-sm:p-0 py-2 px-5">
          <div className="bg-[#eeecfd] border border-[#6950e8] text-[#6950E8] max-sm:p-1 px-4 py-3 rounded-lg relative  mx-auto font-sans text-xs font-semibold leading-normal h-12 max-sm:h-20">
            <div className="flex items-start">
              <div className="flex gap-2">
                <Image
                  src="/images/Info.svg"
                  alt="Lock Icon"
                  height={16}
                  width={16}
                />
                <p className="max-sm:text-xs text-sm flex max-sm:flex-col">
                  A verification email has been sent to your inbox. Please
                  verify your email.
                  {linkResent ? (
                    <span className="font-bold italic flex gap-1 pl-1">
                      <CheckIcon aria-hidden="true" className="h-6 w-5  " />{' '}
                      Link Resent
                    </span>
                  ) : (
                    <>
                      {isLoading ? (
                        <span className="h-4 w-4">
                          <SpinnerLoader color="#6950e8" />
                        </span>
                      ) : (
                        <>
                          <span
                            className="underline cursor-pointer hover:text-blue-500 px-1 max-sm:pt-1"
                            onClick={onClickResend}
                          >
                            Click here
                          </span>{' '}
                          to resend
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
            <span
              onClick={() => setShowAlert(false)}
              className="absolute top-3 right-3 max-sm:right-1 cursor-pointer text-blue-500 hover:text-blue-700"
            >
              <Image
                src="/images/Close.svg"
                alt="Lock Icon"
                height={16}
                width={16}
              />
            </span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EmailVerifyAlert;
