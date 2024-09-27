import { CampaignValues } from '@/app/(private)/(authLayout)/campaign/new/page';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { TrashIcon } from '@heroicons/react/20/solid';
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(() => import('./rich-text-editor'), {
  ssr: false,
});

const EmailForm = ({
  variables,
  startType,
  index,
  handleDelete = () => {},
  control,
  errors,
}: {
  variables: string[];
  startType: 'absolute' | 'gap';
  index: number;
  handleDelete: () => void;
  control: Control<CampaignValues>;
  errors: any;
}) => {
  return (
    <div>
      <div className="py-10 px-5 mb-5 mt-5 ml-2 border-l-2 border-dashed border-[#6950e9] text-[#6950e9] italic text-sm">
        {index === 0 ? 'First email' : `Follow up ${index}`}
      </div>
      <div className="">
        {startType === 'absolute' ? (
          <div>
            <label>Start At</label>
            <br />
            <Controller
              name={`mails.${index}.sendAt`}
              control={control}
              render={({ field }) => (
                <input
                  type="datetime-local"
                  {...field}
                  placeholder="Start At"
                  className={`p-2 border rounded bg-white`}
                  min={new Date().toISOString().slice(0, 16)}
                />
              )}
            />
            {errors?.sendAt && (
              <div className="text-sm text-red-500">
                {errors?.sendAt?.message}
              </div>
            )}
          </div>
        ) : (
          <div>
            <label>Gap</label>
            <br />
            <div className="flex gap-3">
              <Controller
                name={`mails.${index}.gapCount`}
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    placeholder="Count"
                    className={`p-2 border rounded bg-white w-20`}
                  />
                )}
              />
              <Controller
                name={`mails.${index}.gapType`}
                control={control}
                render={({ field }) => (
                  <select {...field} className={`p-2 border rounded bg-white`}>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                )}
              />
            </div>
            {errors?.gapCount && (
              <div className="text-sm text-red-500">
                {errors?.gapCount?.message}
              </div>
            )}
            {errors?.gapType && (
              <div className="text-sm text-red-500">
                {errors?.gapType?.message}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 mb-8 flow-root p-5 rounded-lg border border-[#6950e9]">
        <div>
          <div className="flex justify-end">
            {index !== 0 && (
              <TrashIcon
                onClick={handleDelete}
                aria-hidden="true"
                className="h-6 w-5 flex-none text-red-600 cursor-pointer"
              />
            )}
          </div>
          <div className="flex gap-5">
            <div className="flex-1">
              <div className="mb-5">
                <label htmlFor="subject">Subject</label>
                <br />
                <Controller
                  name={`mails.${index}.subject`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Subject"
                      className={`p-2 w-full border rounded bg-white`}
                    />
                  )}
                />
                {errors?.subject && (
                  <div className="text-sm text-red-500">
                    {errors?.subject?.message}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="content">Body</label>
                <br />
                <RichTextEditor
                  index={index}
                  control={control}
                  variables={variables}
                />
                {errors?.body && (
                  <div className="text-sm text-red-500">
                    {errors?.body?.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
