'use client';

import { createCampeignSchema } from '@/lib/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import useProspectUpload, { CsvRow } from '@/hooks/use-prospect-upload';
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
import { useDarkMode } from '../../contexts/DarkModeContext';
import Image from 'next/image';
import Chip from '../common/chip';

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
  const [summeryVisible, setSummeryVisible] = useState(false);
  const {
    csvData: parsedCsvData,
    csvError,
    onChangeHandler,
    variables,
    handleDownloadSample,
    populateData,
  } = useProspectUpload();
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useDarkMode();
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

  useEffect(() => {
    setCsvData(parsedCsvData);
  }, [parsedCsvData]);

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
    setSummeryVisible(false);
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

  const onViewSummery = () => {
    setSummeryVisible(true);
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
    <div className="min-h-screen">
      <div
        className={`mb-8  max-[400px]:p-2 p-5 rounded-lg shadow-lg ${
          isDarkMode ? 'text-white bg-[#202938]' : 'bg-white text-gray-900'
        }`}
      >
        <div className="flex flex-wrap max-sm:gap-2 gap-5 justify-between">
          <div className="flex-1 max-sm:text-xs">
            <label htmlFor="subject">Name</label>
            <br />
            <Controller
              name={`name`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Name of campeign"
                  className={`w-full p-2 border rounded ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
                />
              )}
            />
            {errors['name'] && (
              <div className="text-sm text-red-500">
                {errors['name'].message}
              </div>
            )}
          </div>
          <div className="flex-1 max-sm:text-xs">
            <label htmlFor="subject">Time Zone</label>
            <br />
            <Controller
              name={`timezone`}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full p-2 border rounded ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'}`}
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
          <div className="flex-1 max-sm:text-xs">
            <EmailSelector control={control} data={formData?.connectedEmails} />
            {errors['fromEmail'] && (
              <div className="text-sm text-red-500">
                {errors['fromEmail'].message}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`mt-3 mb-8  p-5 rounded-lg shadow-lg ${
          isDarkMode ? 'text-white bg-[#202938]' : 'bg-white text-gray-900'
        }`}
      >
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
              <table
                className={`min-w-full ${isDarkMode ? 'bg-[#202938] border-[#121929]' : 'bg-white'} border rounded-lg`}
              >
                <thead>
                  <tr
                    className={`border-b ${isDarkMode ? 'border-[#121929]' : ''}`}
                  >
                    {variables.map((v) => {
                      return (
                        <th
                          key={v}
                          className="text-left py-1 px-3 font-semibold text-sm  whitespace-nowrap"
                        >
                          {v}
                        </th>
                      );
                    })}
                    <th className="text-left py-1  font-semibold text-sm  whitespace-nowrap">
                      <button
                        className="text-[#6950e9] min-w-32  flex justify-center"
                        onClick={() => {
                          setCsvData([]);
                        }}
                      >
                        Delete All
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((user, ind) => (
                    <tr
                      key={ind}
                      className={`border-b ${isDarkMode ? 'border-[#121929]' : ''}`}
                    >
                      {variables.map((v) => {
                        return (
                          <td
                            key={v}
                            className="py-1 px-3 text-sm whitespace-nowrap"
                          >
                            {user[v]}
                          </td>
                        );
                      })}
                      <td>
                        <div className="flex justify-center">
                          <svg
                            onClick={() => {
                              setCsvData((prev) => {
                                return prev.filter(
                                  (row, index) => index != ind
                                );
                              });
                            }}
                            aria-hidden="true"
                            className="h-4 w-3 flex-none text-red-600 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="14"
                            viewBox="0 0 12 14"
                            fill="none"
                          >
                            <path
                              d="M3.62143 0.483984L3.42857 0.875H0.857143C0.383036 0.875 0 1.26602 0 1.75C0 2.23398 0.383036 2.625 0.857143 2.625H11.1429C11.617 2.625 12 2.23398 12 1.75C12 1.26602 11.617 0.875 11.1429 0.875H8.57143L8.37857 0.483984C8.23393 0.185938 7.93661 0 7.6125 0H4.3875C4.06339 0 3.76607 0.185938 3.62143 0.483984ZM11.1429 3.5H0.857143L1.425 12.7695C1.46786 13.4613 2.03036 14 2.70804 14H9.29196C9.96964 14 10.5321 13.4613 10.575 12.7695L11.1429 3.5Z"
                              fill="#DC2626"
                            />
                          </svg>
                        </div>
                      </td>
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
                className="border border-[#6950e9] max-sm:p-[6px] py-2 px-3 rounded-lg font-semibold transition duration-300 max-sm:text-xs"
                onClick={handleAppend}
              >
                Add step
              </button>
            )}
            {csvData.length > 0 && fields.length > 0 && !summeryVisible && (
              <div className="flex gap-2">
                <button
                  className="bg-gray-400 text-white max-sm:p-[6px] max-sm:text-xs py-2 px-5 rounded-lg font-semibold transition duration-300"
                  onClick={handleSubmit(onViewSummery)}
                >
                  Summery
                </button>
                {isExisting ? (
                  <button
                    className="bg-[#6950e9] text-white py-2 px-5 max-sm:p-[6px] max-sm:text-xs rounded-lg font-semibold transition duration-300"
                    disabled={updateLoading}
                    onClick={handleSubmit(onUpdateAndStart)}
                  >
                    {updateLoading ? <SpinnerLoader /> : 'Update And Run'}
                  </button>
                ) : (
                  <button
                    className="bg-[#6950e9] text-white max-sm:p-[6px] max-sm:text-xs py-2 px-5 rounded-lg font-semibold transition duration-300"
                    disabled={isLoading}
                    onClick={handleSubmit(onSaveAndStart)}
                  >
                    {isLoading ? <SpinnerLoader /> : 'Run'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {summeryVisible && (
        <div
          key={Math.random()}
          className={`mt-8 mb-8  p-5 rounded-lg shadow-lg ${
            isDarkMode ? 'text-white bg-[#202938]' : 'bg-white text-gray-900'
          }`}
        >
          <div className="mb-5">Summery</div>
          <div className="flex gap-3 items-start mb-5">
            <Image
              src="/images/email.svg"
              height={18}
              width={18}
              alt="summery"
            />
            <div>
              <p
                className={`text-sm ${isDarkMode ? 'text-[#FFF]' : 'text-[#111827]'}`}
              >
                Send from
              </p>
              <p
                className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
              >
                {getValues('fromEmail')}
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start mb-5">
            <Image
              src="/images/list.svg"
              height={18}
              width={18}
              alt="summery"
            />
            <div>
              <p
                className={`text-sm ${isDarkMode ? 'text-[#FFF]' : 'text-[#111827]'}`}
              >
                Steps
              </p>
              <ul>
                {fields.map((f, ind) => {
                  return (
                    <li key={f.id}>
                      <span
                        className={`text-sm ${isDarkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}
                      >
                        {getValues(`mails.${ind}.subject`)}{' '}
                        <>
                          {getValues(`mails.${ind}.gapType`) ? (
                            <>
                              (after {getValues(`mails.${ind}.gapCount`)}{' '}
                              {getValues(`mails.${ind}.gapType`)})
                            </>
                          ) : (
                            <>
                              (at{' '}
                              {getValues(`mails.${ind}.sendAt`)
                                ? moment(
                                    getValues(`mails.${ind}.sendAt`)
                                  ).format('DD/MM/YYYY')
                                : ''}
                              )
                            </>
                          )}
                        </>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="flex gap-3 items-start mb-5">
            <Image
              src="/images/user-group.svg"
              height={18}
              width={18}
              alt="summery"
            />
            <div>
              <p
                className={`text-sm ${isDarkMode ? 'text-[#FFF]' : 'text-[#111827]'}`}
              >
                Prospects
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                {csvData.map((c, ind) => {
                  return (
                    <Chip
                      variant="outlined"
                      label={c.EMAIL as string}
                      key={ind}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <div></div>
              {isExisting ? (
                <div className="flex gap-2">
                  <button
                    className="bg-gray-400 text-white max-sm:p-[6px] max-sm:text-xs py-2 px-5 rounded-lg font-semibold transition duration-300"
                    disabled={updateLoading}
                    onClick={handleSubmit(onUpdate)}
                  >
                    {updateLoading ? <SpinnerLoader /> : 'Update Draft'}
                  </button>

                  <button
                    className="bg-[#6950e9] text-white py-2 px-5 max-sm:p-[6px] max-sm:text-xs rounded-lg font-semibold transition duration-300"
                    disabled={updateLoading}
                    onClick={handleSubmit(onUpdateAndStart)}
                  >
                    {updateLoading ? <SpinnerLoader /> : 'Update And Run'}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="bg-gray-400 text-white max-sm:p-[6px] max-sm:text-xs py-2 px-5 rounded-lg font-semibold transition duration-300"
                    disabled={isLoading}
                    onClick={handleSubmit(onSave)}
                  >
                    {isLoading ? <SpinnerLoader /> : 'Save as Draft'}
                  </button>

                  <button
                    className="bg-[#6950e9] text-white max-sm:p-[6px] max-sm:text-xs py-2 px-5 rounded-lg font-semibold transition duration-300"
                    disabled={isLoading}
                    onClick={handleSubmit(onSaveAndStart)}
                  >
                    {isLoading ? <SpinnerLoader /> : 'Run'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
