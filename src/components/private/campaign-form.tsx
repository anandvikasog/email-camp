'use client';

import { createCampeignSchema } from '@/lib/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import useProspectUpload from '@/hooks/use-prospect-upload';
import { timezones } from '~/utils/timezones';
import 'react-quill/dist/quill.snow.css';
import EmailForm, {
  defaultTiming,
  ITiming,
} from '@/components/private/email-form';
import EmailSelector from '@/components/private/email-selector';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
} from '@/store/Features/auth/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import SpinnerLoader from '@/components/common/spinner-loader';

export type CampaignValues = zod.infer<typeof createCampeignSchema>;

export interface IMail {
  subject: string;
  body: string;
  sendAt: string;
  timezone: string;
  prospects: any;
  timing: any;
  gapType?: string;
  gapCount?: string;
}

const defaultValues = {
  name: '',
  mails: [{ subject: '', body: '', timing: defaultTiming }],
};

export default function CampaignForm({
  campaignData,
  formData,
}: {
  campaignData?: any;
  formData?: any;
}): React.JSX.Element {
  const [isExisting] = useState(!!campaignData);
  const {
    csvData,
    csvError,
    onChangeHandler,
    variables,
    handleDownloadSample,
    populateData,
  } = useProspectUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createCampaign, { data: createData, isLoading }] =
    useCreateCampaignMutation<any>();
  const [updateCampaign, { data: updateData, isLoading: updateLoading }] =
    useUpdateCampaignMutation<any>();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    trigger,
    reset,
  } = useForm<CampaignValues>({
    defaultValues,
    resolver: zodResolver(createCampeignSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'mails',
  });

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
      timing: defaultTiming,
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const preparePayload = (data: CampaignValues, isDraft: boolean) => {
    const { name, fromEmail, timezone, mails } = data;

    const mutatedMails: IMail[] = [];
    mails.forEach((elem) => {
      if (elem.sendAt) {
        mutatedMails.push({
          subject: elem.subject,
          body: elem.body,
          sendAt: moment(elem.sendAt).toISOString(),
          timezone,
          prospects: csvData.map((e) => ({ prospectData: e })),
          timing: elem.timing,
          gapType: elem.gapType,
          gapCount: elem.gapCount,
        });
      } else if (elem.gapType && elem.gapCount) {
        const lastMailDate = mutatedMails[mutatedMails.length - 1]?.sendAt;
        if (lastMailDate) {
          // @ts-ignore
          const sendAt = moment(lastMailDate).add(
            parseInt(elem.gapCount),
            elem.gapType
          );
          mutatedMails.push({
            subject: elem.subject,
            body: elem.body,
            sendAt: moment(sendAt).toISOString(),
            timezone,
            prospects: csvData.map((e) => ({ prospectData: e })),
            timing: elem.timing,
            gapType: elem.gapType,
            gapCount: elem.gapCount,
          });
        }
      }
    });

    return {
      name,
      fromEmail,
      mails: mutatedMails,
      savedAsDraft: isDraft,
    };
  };

  const onSave = async (data: CampaignValues) => {
    const payload = preparePayload(data, true);
    createCampaign(payload);
  };

  const onSaveAndStart = (data: CampaignValues) => {
    const payload = preparePayload(data, false);
    createCampaign(payload);
  };

  const onUpdate = (data: CampaignValues) => {
    const payload = preparePayload(data, true);
    updateCampaign({ id: campaignData._id, ...payload });
  };

  const onUpdateAndStart = (data: CampaignValues) => {
    const payload = preparePayload(data, false);
    updateCampaign({ id: campaignData._id, ...payload });
  };

  useEffect(() => {
    if (createData) {
      if (createData.isDraft) {
        toast.success(
          createData.message || 'Campaign saved as draft successfully'
        );
      } else {
        toast.success(createData.message || 'Campaign created successfully');
      }
      router.push(paths.private.campaign);
    }
  }, [createData, router]);

  useEffect(() => {
    if (updateData) {
      if (updateData.isDraft) {
        toast.success(updateData.message || 'Draft updated successfully');
      } else {
        toast.success(updateData.message || 'Campaign created successfully');
      }
      router.push(paths.private.campaign);
    }
  }, [updateData, router]);

  useEffect(() => {
    if (campaignData) {
      reset(campaignData);
      populateData(campaignData.prospects);
    }
  }, [campaignData, reset]);

  return (
    <div>
      <div className="mt-3 mb-8  p-5 rounded-lg shadow-lg ">
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
                  placeholder="Name of campeign"
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
            <label htmlFor="subject">Time Zone</label>
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
          <div className="flex-1">
            <EmailSelector control={control} data={formData?.connectedEmails} />
            {errors['fromEmail'] && (
              <div className="text-sm text-red-500">
                {errors['fromEmail'].message}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 mb-8  p-5 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <div className="">
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
              {csvData.length > 0 ? (
                <div className="text-sm italic text-[#6950e9]">
                  {csvData.length} prospects uploaded
                </div>
              ) : null}
              {csvError && (
                <div className="text-sm text-red-500">{csvError}</div>
              )}
            </div>
          </div>
          <div>
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
        </div>
        {csvData.length > 0 && (
          <div className="container mx-auto mt-2">
            <div className="overflow-x-auto h-[200px] overflow-y-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {variables.map((v) => {
                      return (
                        <th
                          key={v}
                          className="text-left py-1 px-3 font-semibold text-sm text-gray-600 whitespace-nowrap"
                        >
                          {v}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((user, ind) => (
                    <tr key={ind} className="border-b hover:bg-gray-50">
                      {variables.map((v) => {
                        return (
                          <td
                            key={v}
                            className="py-1 px-3 text-gray-700 text-sm whitespace-nowrap"
                          >
                            {user[v]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {csvData.length > 0 && (
        <div>
          {fields.map((field, ind) => (
            <EmailForm
              key={field.id}
              variables={variables}
              startType={ind === 0 ? 'absolute' : 'gap'}
              index={ind}
              handleDelete={() => handleRemove(ind)}
              control={control}
              errors={
                errors?.mails && errors?.mails[ind] ? errors?.mails[ind] : {}
              }
              getValues={getValues}
              setValue={setValue}
              trigger={trigger}
            />
          ))}
          <div className="flex justify-between">
            {fields.length >= 5 ? (
              <div></div>
            ) : (
              <button
                className="border border-[#6950e9] py-2 px-3 rounded-lg font-semibold transition duration-300"
                onClick={handleAppend}
              >
                Add step
              </button>
            )}
            {isExisting ? (
              <div className="flex gap-2">
                <button
                  className="bg-gray-400 text-white py-2 px-5 rounded-lg font-semibold transition duration-300"
                  disabled={updateLoading}
                  onClick={handleSubmit(onUpdate)}
                >
                  {updateLoading ? <SpinnerLoader /> : 'Update Draft'}
                </button>

                <button
                  className="bg-[#6950e9] text-white py-2 px-5 rounded-lg font-semibold transition duration-300"
                  disabled={updateLoading}
                  onClick={handleSubmit(onUpdateAndStart)}
                >
                  {updateLoading ? <SpinnerLoader /> : 'Update And Start'}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  className="bg-gray-400 text-white py-2 px-5 rounded-lg font-semibold transition duration-300"
                  disabled={isLoading}
                  onClick={handleSubmit(onSave)}
                >
                  {isLoading ? <SpinnerLoader /> : 'Save as Draft'}
                </button>

                <button
                  className="bg-[#6950e9] text-white py-2 px-5 rounded-lg font-semibold transition duration-300"
                  disabled={isLoading}
                  onClick={handleSubmit(onSaveAndStart)}
                >
                  {isLoading ? <SpinnerLoader /> : 'Save And Start'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
