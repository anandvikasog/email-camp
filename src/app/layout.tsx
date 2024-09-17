import React, { ReactNode, JSX } from 'react';
import type { Viewport } from 'next';
import '@/styles/global.css';

import ToastContext from '@/contexts/toast-context';
import ReduxProvider from '@/contexts/redux-context';
import { DarkModeProvider } from '../contexts/DarkModeContext';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
} satisfies Viewport;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <DarkModeProvider>
            <ToastContext>{children}</ToastContext>
          </DarkModeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
