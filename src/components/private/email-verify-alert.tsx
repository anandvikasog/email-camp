'use client';

import { RootState } from '@/store/store';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/20/solid';
import { useResendVerifyEmailMutation } from '@/store/Features/auth/authApiSlice';
import SpinnerLoader from '../common/spinner-loader';

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
        <div className="py-2 px-5">
          <div className="bg-yellow-100 border border-yellow-500 text-yellow-800 px-4 py-3 rounded-lg relative  mx-auto">
            <div className="flex items-start">
              <div className="flex-1">
                <strong className="font-bold flex gap-1">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="h-6 w-5  "
                  />
                  Verify Your Email
                </strong>
                <p className="text-sm mt-1">
                  A verification email has been sent to your inbox. Please
                  verify your email.
                  <div className="mb-5" />
                  {linkResent ? (
                    <span className="font-bold italic flex gap-1">
                      <CheckIcon aria-hidden="true" className="h-6 w-5  " />{' '}
                      Link Resent
                    </span>
                  ) : (
                    <>
                      {isLoading ? (
                        <SpinnerLoader color="brown" />
                      ) : (
                        <>
                          <span
                            className="underline cursor-pointer hover:text-blue-500"
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
              className="absolute top-2 right-2 cursor-pointer text-blue-500 hover:text-blue-700"
            >
              &times;
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
