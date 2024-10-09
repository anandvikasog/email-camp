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
        className={`w-8 h-8 flex items-center justify-center bg-[#1118270a] rounded-lg absolute top-2 right-2 ${
          isChecked ? '' : ''
        }`}
      >
        {/* <span
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            isChecked ? 'translate-x-5' : 'translate-x-0'
          }`}
        /> */}
        {/* Adding SVG inside the button */}
        <span className="w-5 h-5  flex items-center justify-center text-gray-900">
          <svg
            width="26"
            height="26"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Group 22">
              <path
                id="Vector"
                d="M12.2812 9C12.2812 10.8115 10.8115 12.2812 9 12.2812C7.15771 12.2812 5.71875 10.8115 5.71875 9C5.71875 7.15771 7.15771 5.71875 9 5.71875C10.8115 5.71875 12.2812 7.15771 12.2812 9Z"
                fill={'#6B7280'}
              />
              <path
                id="Vector_2"
                opacity="0.4"
                d="M7.90625 1.34375C7.90625 0.739795 8.39502 0.25 9 0.25C9.60498 0.25 10.0938 0.739795 10.0938 1.34375V2.98438C10.0938 3.58833 9.60498 4.07812 9 4.07812C8.39502 4.07812 7.90625 3.58833 7.90625 2.98438V1.34375ZM2.98438 7.90625C3.58833 7.90625 4.07812 8.39502 4.07812 9C4.07812 9.60498 3.58833 10.0938 2.98438 10.0938H1.34375C0.739795 10.0938 0.25 9.60498 0.25 9C0.25 8.39502 0.739795 7.90625 1.34375 7.90625H2.98438ZM16.6562 7.90625C17.2612 7.90625 17.75 8.39502 17.75 9C17.75 9.60498 17.2612 10.0938 16.6562 10.0938H15.0156C14.4106 10.0938 13.9219 9.60498 13.9219 9C13.9219 8.39502 14.4106 7.90625 15.0156 7.90625H16.6562ZM9 17.75C8.39502 17.75 7.90625 17.2612 7.90625 16.6562V15.0156C7.90625 14.4106 8.39502 13.9219 9 13.9219C9.60498 13.9219 10.0938 14.4106 10.0938 15.0156V16.6562C10.0938 17.2612 9.60498 17.75 9 17.75ZM2.75776 15.2412C2.33086 14.814 2.33086 14.1235 2.75776 13.6963L3.85254 12.6025C4.27979 12.1753 4.97021 12.1753 5.39746 12.6025C5.82471 13.0298 5.82471 13.7202 5.39746 14.1475L4.30371 15.2412C3.87646 15.6685 3.18501 15.6685 2.75776 15.2412ZM13.6963 2.75776C14.1235 2.33086 14.814 2.33086 15.2412 2.75776C15.6685 3.18501 15.6685 3.87646 15.2412 4.30371L14.1475 5.39746C13.7202 5.82471 13.0298 5.82471 12.6025 5.39746C12.1753 4.97021 12.1753 4.27979 12.6025 3.85254L13.6963 2.75776ZM15.2412 15.2412C14.814 15.6685 14.1235 15.6685 13.6963 15.2412L12.6025 14.1475C12.1753 13.7202 12.1753 13.0298 12.6025 12.6025C13.0298 12.1753 13.7202 12.1753 14.1475 12.6025L15.2412 13.6963C15.6685 14.1235 15.6685 14.814 15.2412 15.2412ZM2.75776 4.30371C2.33086 3.87646 2.33086 3.18501 2.75776 2.75776C3.18501 2.33086 3.87646 2.33086 4.30371 2.75776L5.39746 3.85254C5.82471 4.27979 5.82471 4.97021 5.39746 5.39746C4.97021 5.82471 4.27979 5.82471 3.85254 5.39746L2.75776 4.30371Z"
                fill="#6B7280"
              />
            </g>
          </svg>
        </span>
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
