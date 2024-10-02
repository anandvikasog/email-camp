'use client';

import { createCampeignSchema } from '@/lib/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import useProspectUpload from '@/hooks/use-prospect-upload';
import { timezones } from '~/utils/timezones';
import 'react-quill/dist/quill.snow.css';
import EmailForm from '@/components/private/email-form';
import EmailSelector from '@/components/private/email-selector';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import {
  useGetCampaignByIdQuery,
  useUpdateCampaignMutation,
} from '@/store/Features/auth/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation';
import { paths } from '@/paths';
import SpinnerLoader from '@/components/common/spinner-loader';

export type CampaignValues = zod.infer<typeof createCampeignSchema>;

export interface IMail {
  subject: string;
  body: string;
  sendAt: string;
  timezone: string;
  prospects: any;
}

interface DraftResponse {
  status: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    userId: string;
    mails: Array<{
      sendAt: string;
      subject: string;
      body: string;
      prospects: Array<{
        prospectData: any;
        isDelivered: boolean;
        isBounced: boolean;
        isRejected: boolean;
        _id: string;
      }>;
    }>;
    fromEmail: string;
    status: string;
    savedAsDraft: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export default function UpdateCampaignPage(): React.JSX.Element {
  const { id: draftId } = useParams(); // Get the draft ID if editing a draft
  const { data: draftData, isLoading: isDraftLoading } =
    useGetCampaignByIdQuery<any>(draftId, { skip: !draftId });
  // Mutation to update campaign
  const [updateCampaign, { isLoading }] = useUpdateCampaignMutation();
  const {
    csvData,
    csvError,
    onChangeHandler,
    variables,
    handleDownloadSample,
  } = useProspectUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CampaignValues>({
    defaultValues: {
      name: draftData?.data.name || '',
      mails: draftData?.data.mails?.map((mail: IMail) => ({
        subject: mail.subject,
        body: mail.body,
        sendAt: mail.sendAt,
      })) || [{ subject: '', body: '', sendAt: '' }], // Default mail structure
      fromEmail: draftData?.data.fromEmail || '',
      timezone: '',
    },
    resolver: zodResolver(createCampeignSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'mails',
  });

  useEffect(() => {
    if (draftData) {
      // Prefill the form with the fetched data
      setValue('name', draftData.data.name);
      setValue(
        'mails',
        draftData.data.mails.map((mail: IMail) => ({
          subject: mail.subject,
          body: mail.body,
          sendAt: mail.sendAt,
        }))
      );
      setValue('fromEmail', draftData.data.fromEmail);
    }
  }, [draftData, setValue]);

  const handleRemove = (ind: number) => {
    remove(ind);
  };

  const handleAppend = () => {
    if (fields.length >= 5) {
      return;
    }
    append({
      subject: '',
      body: '',
      sendAt: '',
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const preparePayload = (data: CampaignValues) => {
    const { name, fromEmail, timezone, mails } = data;
    const mutatedMails: IMail[] = mails
      .map((elem) => {
        if (elem.sendAt) {
          return {
            subject: elem.subject,
            body: elem.body,
            sendAt: moment(elem.sendAt).toISOString(),
            timezone,
            prospects:
              csvData.length > 0
                ? csvData.map((e) => ({ prospectData: e }))
                : [],
          };
        }
        return undefined;
      })
      .filter((mail): mail is IMail => mail !== undefined);

    return {
      name,
      fromEmail,
      mails: mutatedMails,
      savedAsDraft: draftData?.data.savedAsDraft,
    };
  };

  const onSubmit = async (data: CampaignValues) => {
    const payload = preparePayload(data);
    try {
      // Call the API to update the campaign
      await updateCampaign({ id: draftId, ...payload }).unwrap();

      toast.success('Campaign updated successfully');

      router.push(paths.private.campaign); // Adjust this route as needed
    } catch (error) {
      console.error(error);
      toast.error('Failed to update campaign');
    }
  };

  return (
    <div>
      {isDraftLoading ? (
        <SpinnerLoader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3 mb-8 p-5 rounded-lg shadow-lg">
            <div className="flex flex-wrap gap-5 justify-between">
              <div className="flex-1">
                <label htmlFor="subject">Name</label>
                <br />
                <Controller
                  name={`name`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Name of campaign"
                      className={`w-full p-2 border rounded bg-white`}
                    />
                  )}
                />
                {errors['name'] && (
                  <div className="text-sm text-red-500">
                    {errors['name'].message}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <EmailSelector control={control} />
                {errors['fromEmail'] && (
                  <div className="text-sm text-red-500">
                    {errors['fromEmail'].message}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="timezone">Time Zone</label>
                <br />
                <Controller
                  name={`timezone`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full p-2 border rounded bg-white`}
                    >
                      <option value="">Select</option>
                      {timezones.map((elem) => (
                        <option key={elem.timezone} value={elem.timezone}>
                          {elem.timezone} ({elem.code})
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors['timezone'] && (
                  <div className="text-sm text-red-500">
                    {errors['timezone'].message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 mb-8 p-5 rounded-lg shadow-lg flex justify-between">
            <div>
              <div className="flex flex-1">
                <label
                  htmlFor="file-input"
                  className="flex gap-3 cursor-pointer border p-2 rounded border-[#6950e9]"
                >
                  Upload Prospects{' '}
                  <ArrowUpTrayIcon
                    onClick={triggerFileInput}
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-[#6950e9] cursor-pointer"
                  />
                </label>
                <input
                  id="file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={onChangeHandler}
                  className="hidden"
                />
              </div>
              <div className="mt-2">
                {csvData.length > 0 && (
                  <div className="text-sm italic text-[#6950e9]">
                    {csvData.length} prospects uploaded
                  </div>
                )}
                {csvError && (
                  <div className="text-sm text-red-500">{csvError}</div>
                )}
              </div>
            </div>
            <div
              className="flex gap-1 cursor-pointer p-2 rounded text-[#6950e9] text-sm"
              onClick={handleDownloadSample}
            >
              <ArrowDownTrayIcon
                aria-hidden="true"
                className="h-6 w-5 flex-none text-[#6950e9] cursor-pointer"
              />
              Download Sample
            </div>
          </div>

          <div>
            {fields.length > 0 &&
              fields.map((field, ind) => (
                <EmailForm
                  key={field.id}
                  index={ind}
                  variables={variables}
                  startType={ind === 0 ? 'absolute' : 'gap'}
                  control={control}
                  handleDelete={() => handleRemove(ind)}
                  errors={errors}
                />
              ))}
            <div className="flex justify-between">
              {fields.length < 5 && (
                <button
                  type="button"
                  onClick={handleAppend}
                  className="px-3 py-2 text-sm rounded bg-[#6950e9] text-white"
                >
                  Add Email Step
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Update Campaign
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
