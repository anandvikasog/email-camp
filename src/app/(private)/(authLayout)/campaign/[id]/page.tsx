import React from 'react';
import CampaignForm from '@/components/private/campaign-form';
import type { Metadata } from 'next';
import { config } from '@/config';
import { getConnectedEmailS, getOneCampaign } from '@/lib/actions/campaign';
import { paths } from '@/paths';
import { redirect } from 'next/navigation';
import { ConnectedEmailType } from '../../connect-email/page';
import moment from 'moment';

export const metadata = {
  title: `Edit Campaign | ${config.site.name}`,
} satisfies Metadata;

export default async function Page({ params }: { params: { id: string } }) {
  const campaign = await getOneCampaign(params.id);

  const data = JSON.parse(campaign);
  if (!data.status) {
    redirect(paths.private.campaign);
  }
  const formatedData = formatCampaignData(data.data);

  const connected = await getConnectedEmailS();
  const connectedEmails = JSON.parse(connected);

  return (
    <CampaignForm
      campaignData={formatedData}
      formData={{ connectedEmails: connectedEmails }}
    />
  );
}

const formatCampaignData = (data: any) => {
  const newData = { ...data };
  newData.timezone = data.mails[0].timezone;
  newData.prospects = data.mails[0]
    ? data.mails[0].prospects.map((p: any) => p.prospectData)
    : [];
  newData.mails = newData.mails.map((m: any) => {
    return {
      body: m.body,
      subject: m.subject,
      sendAt: moment(m.sendAt).format('YYYY-MM-DDTHH:mm'),
      timing: m.timing,
      gapType: m.gapType,
      gapCount: m.gapCount?.toString(),
    };
  });
  return newData;
};
