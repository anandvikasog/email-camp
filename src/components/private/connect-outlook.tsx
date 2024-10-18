'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SpinnerLoader from '../common/spinner-loader';
import { useConnectMicrosoftMutation } from '@/store/Features/auth/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

const ConnectOutlookButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [connectMicrosoft, { data, isLoading }] =
    useConnectMicrosoftMutation<any>();

  const openMicrosoftPopup = () => {
    if (loading) {
      return;
    }

    const microsoftClientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}connect-email/microsoft`;
    const scope = 'Mail.Send Mail.Read User.Read';
    const popupWidth = 500;
    const popupHeight = 600;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;

    // Microsoft OAuth 2.0 Authorization URL
    const microsoftUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${microsoftClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&response_mode=fragment&prompt=select_account`;

    window.open(
      microsoftUrl,
      'MicrosoftLogin',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    );

    setLoading(true);

    const interval = setInterval(() => {
      console.log('detecting token ...');
      let microsoftData: any = localStorage.getItem('microsoft');
      if (microsoftData) {
        microsoftData = JSON.parse(microsoftData);
        if (microsoftData.token) {
          clearInterval(interval);
          localStorage.removeItem('microsoft');
          setLoading(false);
          connectMicrosoft({ token: microsoftData.token });
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
      onClick={openMicrosoftPopup}
      disabled={loading || isLoading}
    >
      <Image
        src="/images/microsoft-icon.png"
        alt="gmail"
        height={20}
        width={20}
      />
      Continue Connecting Microsoft/Outlook
      {(loading || isLoading) && <SpinnerLoader color="blue" />}
    </button>
  );
};

export default ConnectOutlookButton;
