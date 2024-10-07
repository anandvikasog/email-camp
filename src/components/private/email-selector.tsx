'use client';

import { useGetConnectedEmailMutation } from '@/store/Features/auth/authApiSlice';
import React, { useEffect, useState } from 'react';
import { ConnectedEmailType } from '@/app/(private)/(authLayout)/connect-email/page';
import { Control, Controller } from 'react-hook-form';

const EmailSelector = ({
  control,
  data = [],
}: {
  control: Control<any>;
  data?: ConnectedEmailType[];
}) => {
  const [getEmails, { data: connectedEmails, isLoading }] =
    useGetConnectedEmailMutation<any>({});
  const [verifiedMails, setVerifiedMails] =
    useState<ConnectedEmailType[]>(data);

  useEffect(() => {
    if (verifiedMails.length === 0) {
      getEmails({});
    }
  }, [verifiedMails]);

  useEffect(() => {
    if (connectedEmails) {
      setVerifiedMails(
        connectedEmails.data.filter(
          (e: ConnectedEmailType) => e.verified === true
        )
      );
    }
  }, [connectedEmails]);
  console.log('rendering----------');
  return (
    <>
      <label htmlFor="subject">Sender Email</label>
      <br />
      <Controller
        name={`fromEmail`}
        control={control}
        render={({ field }) => (
          <select {...field} className={`w-full p-2 border rounded bg-white`}>
            <option value="">{isLoading ? 'Loading...' : 'Select'}</option>
            {verifiedMails.map((elem) => (
              <option key={elem._id} value={elem._id}>
                {elem.emailId}
              </option>
            ))}
          </select>
        )}
      />
    </>
  );
};

export default EmailSelector;
