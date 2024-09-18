import React from 'react';

type ToggleButtonProps = {
  isChecked: boolean;
  onChange: () => void;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isChecked,
  onChange,
}) => {
  return (
    <label
      htmlFor="darkModeToggle"
      className="flex items-center cursor-pointer"
    >
      <span
        className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 absolute top-2 right-2 ${
          isChecked ? 'bg-[#6950e9]' : ''
        }`}
      >
        <span
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            isChecked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
      <input
        type="checkbox"
        id="darkModeToggle"
        className="sr-only"
        checked={isChecked}
        onChange={onChange}
      />
    </label>
  );
};
