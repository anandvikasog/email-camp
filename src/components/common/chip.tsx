import React from 'react';

interface IChip {
  label: string;
  color?:
    | 'success'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'primary'
    | 'info'
    | 'default';
  variant?: 'solid' | 'outlined' | 'default';
}

const bgDarkMap = {
  success: '#11B886',
  warning: '#FEBF06',
  danger: '#EF4770',
  secondary: '#E5E7EB',
  primary: '#6950E8',

  default: '#6B7280',
  info: '#3B82F6',
};

const bgLightMap = {
  success: 'rgba(17, 184, 134, 0.10)',
  warning: 'rgba(254, 191, 6, 0.10)',
  danger: 'rgba(239, 71, 112, 0.10)',
  secondary: 'rgba(229, 231, 235, 0.10)',

  primary: 'rgba(105, 80, 232, 0.10)',
  info: 'rgba(59, 130, 246, 0.10)',
  default: '#F3F4F6',
};

const Chip = ({ label, color = 'default', variant = 'default' }: IChip) => {
  return (
    <span
      className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap`}
      style={
        variant === 'solid'
          ? { backgroundColor: bgDarkMap[color], color: 'white' }
          : variant === 'outlined'
            ? {
                borderColor: bgDarkMap[color],
                color: bgDarkMap[color],
                borderWidth: '1px',
                borderStyle: 'solid',
              }
            : { backgroundColor: bgLightMap[color], color: bgDarkMap[color] }
      }
    >
      {label}
    </span>
  );
};

export default Chip;
