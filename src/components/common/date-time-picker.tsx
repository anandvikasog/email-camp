import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Popover } from '@headlessui/react';

type DateTimePickerProps = {
  type: 'date' | 'time' | 'date-time';
  control: any; // passed from react-hook-form
  name: string;
  label: string;
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  type,
  control,
  name,
  label,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date) => {
    if (type === 'date') return date.toLocaleDateString();
    if (type === 'time')
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="relative">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            {label}
          </label>
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className="w-full p-2 border rounded-lg flex justify-between items-center text-gray-700"
                  onClick={() => setOpen(!open)}
                >
                  {selectedDate ? formatDate(selectedDate) : 'Select Date/Time'}
                  @@
                </Popover.Button>

                {open && (
                  <Popover.Panel className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-4 flex flex-col items-center space-y-4">
                      {/* Date Picker */}
                      {type === 'date' || type === 'date-time' ? (
                        <input
                          type="date"
                          className="border p-2 rounded-lg"
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            setSelectedDate(date);
                            field.onChange(date);
                          }}
                        />
                      ) : null}

                      {/* Time Picker */}
                      {type === 'time' || type === 'date-time' ? (
                        <input
                          type="time"
                          className="border p-2 rounded-lg"
                          onChange={(e) => {
                            const time = e.target.value;
                            const [hours, minutes] = time.split(':');
                            const updatedDate = selectedDate || new Date();
                            updatedDate.setHours(
                              Number(hours),
                              Number(minutes)
                            );
                            setSelectedDate(updatedDate);
                            field.onChange(updatedDate);
                          }}
                        />
                      ) : null}
                    </div>
                  </Popover.Panel>
                )}
              </>
            )}
          </Popover>
        </div>
      )}
    />
  );
};

export default DateTimePicker;
