import React, { ReactNode, JSX } from 'react';
import { AuthSidePanel } from './auth-left-panel';
// import { authLayoutCardData } from './DividerCardData';

export interface LayoutProps {
  children: ReactNode;
  img?: string;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="">
      <div>{children}</div>
    </div>
  );
}
