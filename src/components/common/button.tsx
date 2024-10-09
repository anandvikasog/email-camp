import React, { ReactNode } from 'react';

// Define button props
interface IButtonBaseProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  color?:
    | 'success'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'primary'
    | 'default';
  variant?: 'default' | 'outlined' | 'text';
}

interface IButtonAsButton extends IButtonBaseProps {
  as?: 'button';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface IButtonAsLink extends IButtonBaseProps {
  as: 'a' | React.ElementType;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

type IButtonProps = IButtonAsButton | IButtonAsLink;

const bgDarkMap = {
  success: '#11B886',
  warning: '#FEBF06',
  danger: '#EF4770',
  secondary: '#E5E7EB',
  primary: '#6950E8',
  default: '#6B7280',
};

const Button = ({
  as = 'button',
  startIcon = '',
  endIcon = '',
  children = 'Submit',
  variant = 'default',
  color = 'primary',
  ...other
}: IButtonProps) => {
  const Component = as || 'button';
  return (
    <Component
      className="flex items-center gap-1 rounded-lg px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      {...other}
      style={
        variant === 'default'
          ? { backgroundColor: bgDarkMap[color], color: 'white' }
          : variant === 'outlined'
            ? {
                borderColor: bgDarkMap[color],
                color: bgDarkMap[color],
                borderWidth: '1px',
                borderStyle: 'solid',
              }
            : { color: bgDarkMap[color] }
      }
    >
      {startIcon}
      {children}
      {endIcon}
    </Component>
  );
};

export default Button;
