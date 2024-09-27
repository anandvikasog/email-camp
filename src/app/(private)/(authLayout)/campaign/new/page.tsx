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
import { useCreateCampaignMutation } from '@/store/Features/auth/authApiSlice';
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
}

const defaultValues = {
  name: '',
  mails: [{ subject: '', body: '' }],
};

export default function Page(): React.JSX.Element {
  const {
    csvData,
    csvError,
    onChangeHandler,
    variables,
    handleDownloadSample,
  } = useProspectUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createCampaign, { data, isLoading }] =
    useCreateCampaignMutation<any>();
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
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
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: CampaignValues) => {
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
        });
      } else if (elem.gapType && elem.gapCount) {
        const lastMailDate = mutatedMails[mutatedMails.length - 1].sendAt;
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
        });
      }
    });

    const payload = {
      name,
      fromEmail,
      mails: mutatedMails,
    };

    createCampaign(payload);
  };

  useEffect(() => {
    if (data) {
      toast.success(data.message || 'Created successfully');
      router.push(paths.private.campaign);
    }
  }, [data, router]);

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
            <EmailSelector control={control} />
            {errors['fromEmail'] && (
              <div className="text-sm text-red-500">
                {errors['fromEmail'].message}
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
        </div>
      </div>
      <div className="mt-3 mb-8  p-5 rounded-lg shadow-lg flex justify-between">
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
            {csvError && <div className="text-sm text-red-500">{csvError}</div>}
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
            <button
              className="bg-[#6950e9] text-white py-2 px-5 rounded-lg font-semibold transition duration-300"
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? <SpinnerLoader /> : 'Create'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
