'use client';

import { useQueryConnectedEmailQuery } from '@/store/Features/auth/authApiSlice';
import React, { useEffect, useState } from 'react';
import { ConnectedEmailType } from '@/app/(private)/(authLayout)/connect-email/page';
import { CampaignValues } from '@/app/(private)/(authLayout)/campaign/new/page';
import { Control, Controller } from 'react-hook-form';

const EmailSelector = ({ control }: { control: Control<CampaignValues> }) => {
  const { data: connectedEmails, isLoading } = useQueryConnectedEmailQuery<any>(
    {}
  );
  const [verifiedMails, setVerifiedMails] = useState<ConnectedEmailType[]>([]);

  useEffect(() => {
    if (connectedEmails) {
      setVerifiedMails(
        connectedEmails.data.filter(
          (e: ConnectedEmailType) => e.verified === true
        )
      );
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
