import React from 'react';
import CampaignForm from '@/components/private/campaign-form';
import type { Metadata } from 'next';
import { config } from '@/config';

export const metadata = {
  title: `New Campaign | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <CampaignForm />;
}
