'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SpinnerLoader from '../common/spinner-loader';
import { useConnectGoogleMutation } from '@/store/Features/auth/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

const ConnectGmailButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [connectGoogle, { data, isLoading }] = useConnectGoogleMutation<any>();
  const openGooglePopup = () => {
    if (loading) {
      return;
    }
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}connect-email/google`;
    const scope =
      'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    const popupWidth = 500;
    const popupHeight = 600;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;

    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=select_account`;

    window.open(
      googleUrl,
      'GoogleLogin',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    );

    setLoading(true);

    const interval = setInterval(() => {
      console.log('detecting token ...');
      let googleData: any = localStorage.getItem('google');
      if (googleData) {
        googleData = JSON.parse(googleData);
        if (googleData.token) {
          clearInterval(interval);
          localStorage.removeItem('google');
          setLoading(false);
          connectGoogle({ token: googleData.token });
        }
      }
    }, 500);
  };

  useEffect(() => {
    if (data) {
      toast.success(data.message);
      router.push(paths.private.editConnectedEmail(data.data._id));
    }
  }, [data, router]);

  return (
    <button
      className={`flex justify-center items-center gap-3 font-thin py-3 rounded-lg border p-10 border-gray-500 text-[#111827]`}
      onClick={openGooglePopup}
      disabled={loading || isLoading}
    >
      <Image src="/images/google-icon.png" alt="gmail" height={20} width={20} />
      Continue Connecting Google/Gmail
      {(loading || isLoading) && <SpinnerLoader color="blue" />}
    </button>
  );
};

export default ConnectGmailButton;
