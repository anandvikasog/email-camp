import React, { useState } from 'react';
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';
import { TrashIcon } from '@heroicons/react/20/solid';
import dynamic from 'next/dynamic';
import { CampaignValues } from './campaign-form';
import { useDarkMode } from '../../contexts/DarkModeContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { TextField, IconButton, InputAdornment, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const RichTextEditor = dynamic(() => import('./rich-text-editor'), {
  ssr: false,
});

type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface IInterval {
  start: string;
  end: string;
}

export interface ITiming {
  [key: string]: {
    checked: boolean;
    intervals: IInterval[];
  };
}
const weekDays: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const daysNameMap = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export const defaultInterval: IInterval = {
  start: '10:00',
  end: '19:00',
};

export const defaultTiming = {
  mon: {
    checked: true,
    intervals: [defaultInterval],
  },
  tue: {
    checked: true,
    intervals: [defaultInterval],
  },
  wed: {
    checked: true,
    intervals: [defaultInterval],
  },
  thu: {
    checked: true,
    intervals: [defaultInterval],
  },
  fri: {
    checked: true,
    intervals: [defaultInterval],
  },
  sat: {
    checked: false,
    intervals: [defaultInterval],
  },
  sun: {
    checked: false,
    intervals: [defaultInterval],
  },
};

const EmailForm = ({
  variables,
  startType,
  index,
  handleDelete = () => {},
  control,
  errors,
  getValues,
  setValue,
  trigger,
}: {
  variables: string[];
  startType: 'absolute' | 'gap';
  index: number;
  handleDelete: () => void;
  control: Control<CampaignValues>;
  errors: any;
  getValues: UseFormGetValues<CampaignValues>;
  setValue: UseFormSetValue<CampaignValues>;
  trigger: UseFormTrigger<CampaignValues>;
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div>
      <div className="py-10 px-5 mb-5 mt-5 ml-2 border-l-2 border-dashed border-[#6950e9] text-[#6950e9] italic text-sm">
        {index === 0 ? 'First email' : `Follow up ${index}`}
      </div>
      <div>
        {startType === 'absolute' ? (
          <div className="">
            <label>Start Date</label>
            <br />

            {/* <DateTimePicker
              control={control}
              type="date-time"
              name={`mails.${index}.sendAt`}
              label="Select date"
            /> */}
            <Controller
              name={`mails.${index}.sendAt`}
              control={control}
              render={({ field }) => (
                // <input
                //   type="datetime-local"
                //   {...field}
                //   placeholder="Start At"
                //   className={`p-2 border rounded ${
                //     isDarkMode
                //       ? 'text-white bg-[#202938]'
                //       : 'bg-white text-gray-900'
                //   }`}
                //   min={new Date().toISOString().slice(0, 16)}
                // />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(date) => {
                      field.onChange(date ? dayjs(date).format('HH:mm') : '');
                    }}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    slotProps={{
                      popper: {
                        sx: {
                          '& .MuiPaper-root': {
                            width: '100%', // Ensure the clock fits the width of the popper
                            '& .MuiClock-pin': {
                              backgroundColor: '#6950e9',
                            },
                            '& .Mui-selected': {
                              backgroundColor: '#6950e9',
                            },
                            '& .MuiClockPointer-root': {
                              backgroundColor: '#6950e9',
                            },
                            '& .MuiPickersArrowSwitcher-root': {
                              right: 0,
                              top: 0,
                            },
                            '& .MuiClockPointer-thumb': {
                              borderColor: '#6950e9',
                            },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
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
                    className={`p-2 border rounded ${
                      isDarkMode
                        ? 'text-white bg-[#202938]'
                        : 'bg-white text-gray-900'
                    } w-20`}
                  />
                )}
              />
              <Controller
                name={`mails.${index}.gapType`}
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`p-2 border rounded ${
                      isDarkMode
                        ? 'text-white bg-[#202938]'
                        : 'bg-white text-gray-900'
                    }`}
                  >
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
        <div className="mt-2">
          {weekDays.map((key) => (
            <WeeklyScadule
              key={key}
              day={key}
              control={control}
              mailIndex={index}
              getValues={getValues}
              errors={errors?.timing ? errors?.timing[key] : {}}
              setValue={setValue}
              trigger={trigger}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 mb-8 flow-root p-5 rounded-lg border border-[#6950e9]">
        <div>
          <div className="flex justify-end">
            {index !== 0 && (
              <svg
                onClick={handleDelete}
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
                      className={`p-2 w-full border rounded ${
                        isDarkMode
                          ? 'text-white bg-[#202938]'
                          : 'bg-white text-gray-900'
                      }`}
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

const WeeklyScadule = ({
  day,
  mailIndex,
  control,
  getValues,
  errors,
  setValue,
  trigger,
}: {
  day: WeekDay;
  mailIndex: number;
  control: Control<CampaignValues>;
  getValues: UseFormGetValues<CampaignValues>;
  errors: any;
  setValue: UseFormSetValue<CampaignValues>;
  trigger: UseFormTrigger<CampaignValues>;
}) => {
  const [enabled, setEnabled] = useState(
    getValues(`mails.${mailIndex}.timing.${day}.checked`)
  );
  const { isDarkMode } = useDarkMode();

  return (
    <div className="py-1">
      <div className="text-sm flex gap-3 max-[400px]:flex-col pl-1">
        <div className={`w-[120px] cursor-pointer `}>
          <Controller
            name={`mails.${mailIndex}.timing.${day}.checked`}
            control={control}
            render={({ field }) => (
              <input
                id={`check-${day}`}
                type="checkbox"
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  setEnabled(e.target.checked);
                  if (!e.target.checked) {
                    setValue(
                      `mails.${mailIndex}.timing.${day}.intervals.${0}`,
                      defaultInterval
                    );
                    trigger(`mails.${mailIndex}.timing.${day}.intervals.${0}`);
                  }
                }}
              />
            )}
          />
          <label htmlFor={`check-${day}`}> {daysNameMap[day]}</label>{' '}
        </div>
        {enabled && (
          <div className="">
            <Controller
              name={`mails.${mailIndex}.timing.${day}.intervals.${0}.start`}
              control={control} // The control object from useForm
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(date) => {
                      field.onChange(date ? dayjs(date).format('HH:mm') : '');
                    }}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }} // Render clock picker for all views
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          minWidth: 100,
                          backgroundColor: isDarkMode ? '#202938' : 'white', // Conditional background color

                          '& .MuiInputBase-input': {
                            padding: '4px', // Reduce input padding
                          },
                        },
                        InputProps: {
                          sx: {
                            color: isDarkMode ? 'white' : 'black',
                            '& .MuiSvgIcon-root': {
                              fontSize: '16px', // Keep the clock icon size
                            },
                          },
                        },
                      },
                      popper: {
                        modifiers: [
                          {
                            name: 'flip',
                            enabled: true,
                          },
                          {
                            name: 'preventOverflow',
                            enabled: true,
                            options: {
                              boundary: 'viewport', // Ensure the popper is inside the viewport
                            },
                          },
                          {
                            name: 'sameWidth',
                            enabled: true,
                            phase: 'beforeWrite',
                            requires: ['computeStyles'],
                            fn: ({ state }) => {
                              state.styles.popper.width = `${state.rects.reference.width}px`;
                            },
                          },
                        ],
                        sx: {
                          '& .MuiPaper-root': {
                            width: '100%', // Ensure the clock fits the width of the popper
                            '& .MuiClock-pin': {
                              backgroundColor: '#6950e9',
                            },
                            '& .Mui-selected': {
                              backgroundColor: '#6950e9',
                            },
                            '& .MuiClockPointer-root': {
                              backgroundColor: '#6950e9',
                            },
                            '& .MuiPickersArrowSwitcher-root': {
                              right: 0,
                              top: 0,
                            },
                            '& .MuiClockPointer-thumb': {
                              borderColor: '#6950e9',
                            },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />{' '}
            -{' '}
            <Controller
              name={`mails.${mailIndex}.timing.${day}.intervals.${0}.end`}
              control={control} // The control object from useForm
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(date) => {
                      field.onChange(date ? dayjs(date).format('HH:mm') : '');
                    }}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }} // Render clock picker for all views
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: {
                          minWidth: 100,
                          backgroundColor: isDarkMode ? '#202938' : 'white', // Conditional background color
                          '& .MuiInputBase-input': {
                            padding: '4px', // Reduce input padding
                          },
                        },
                        InputProps: {
                          sx: {
                            color: isDarkMode ? 'white' : 'black',
                            '& .MuiSvgIcon-root': {
                              fontSize: '16px', // Keep the clock icon size
                            },
                          },
                        },
                      },
                      popper: {
                        modifiers: [
                          {
                            name: 'flip',
                            enabled: true,
                          },
                          {
                            name: 'preventOverflow',
                            enabled: true,
                            options: {
                              boundary: 'viewport', // Ensure the popper is inside the viewport
                            },
                          },
                          {
                            name: 'sameWidth',
                            enabled: true,
                            phase: 'beforeWrite',
                            requires: ['computeStyles'],
                            fn: ({ state }) => {
                              state.styles.popper.width = `${state.rects.reference.width}px`;
                            },
                          },
                        ],
                        sx: {
                          '& .MuiPaper-root': {
                            width: '100%', // Ensure the clock fits the width of the popper
                            '& .MuiClock-pin': {
                              backgroundColor: '#6950e9',
                            },
                            '& .Mui-selected': {
                              backgroundColor: '#6950e9',
                            },
                            '& .MuiClockPointer-root': {
                              backgroundColor: '#6950e9',
                            },
                            '& .MuiPickersArrowSwitcher-root': {
                              right: 0,
                              top: 0,
                            },
                            '& .MuiClockPointer-thumb': {
                              borderColor: '#6950e9',
                            },
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </div>
        )}
      </div>
      {errors?.checked && (
        <div className="text-sm text-red-500">{errors?.checked?.message}</div>
      )}
      {errors?.intervals?.[0]?.start && (
        <div className="text-sm text-red-500">
          {errors?.intervals[0].start.message}
        </div>
      )}
      {errors?.intervals?.[0]?.end && (
        <div className="text-sm text-red-500">
          {errors?.intervals[0].end.message}
        </div>
      )}
    </div>
  );
};
