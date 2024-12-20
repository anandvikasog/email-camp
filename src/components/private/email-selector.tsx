'use client';

import { useGetConnectedEmailMutation } from '@/store/Features/auth/authApiSlice';
import React, { useEffect, useState } from 'react';
import { ConnectedEmailType } from '@/app/(private)/(authLayout)/connect-email/page';
import { Control, Controller } from 'react-hook-form';
import { useDarkMode } from '../../contexts/DarkModeContext';

const EmailSelector = ({
  control,
  data = [],
}: {
  control: Control<any>;
  data?: ConnectedEmailType[];
}) => {
  const [getEmails, { data: connectedEmails, isLoading }] =
    useGetConnectedEmailMutation<any>({});

  const [verifiedMails, setVerifiedMails] = useState<{
    data: ConnectedEmailType[];
  }>(data as any);

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    if (data.length === 0) {
      getEmails({});
    }
  }, []);

  useEffect(() => {
    if (connectedEmails) {
      setVerifiedMails(connectedEmails);
    }
  }, [connectedEmails]);

  return (
    <>
      <label htmlFor="subject">Sender Email</label>
      <br />
      <Controller
        name={`fromEmail`}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className={`w-full p-2 border rounded ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
          >
            <option value="">{isLoading ? 'Loading...' : 'Select'}</option>
            {verifiedMails &&
              verifiedMails?.data?.map((elem) => (
                <option key={elem._id} value={`${elem._id}`}>
                  {elem.emailId} ({elem.type})
                </option>
              ))}
          </select>
        )}
      />
    </>
  );
};

export default EmailSelector;
