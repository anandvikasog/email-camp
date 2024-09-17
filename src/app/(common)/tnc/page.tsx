import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';

export const metadata = {
  title: `Terms | ${config.site.name}`,
} satisfies Metadata;

export default function NotFound(): React.JSX.Element {
  return <div>Terms and conditions</div>;
}