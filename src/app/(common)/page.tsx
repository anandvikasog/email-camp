import { config } from '@/config';
import { paths } from '@/paths';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata = {
  title: `${config.site.name}`,
} satisfies Metadata;

export default function Page() {
  return <div>payment plans</div>;
}
