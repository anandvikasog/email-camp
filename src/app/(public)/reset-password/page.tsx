import * as React from "react";
import type { Metadata } from "next";

import { config } from "@/config";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { redirect } from "next/navigation";
import { paths } from "@/paths";
import { verifyForgetPassword } from "@/lib/actions/auth";
import { Layout } from "@/components/auth/layout";

export const metadata = {
  title: `Reset password | ${config.site.name}`,
} satisfies Metadata;

const Page = async ({ searchParams }: { searchParams: { code: string } }) => {
  if (!searchParams?.code) {
    redirect(paths.common.home);
  }

  let verifyResponse: any = await verifyForgetPassword({
    code: searchParams.code,
  });
  verifyResponse = JSON.parse(verifyResponse);
  if (!verifyResponse.status) {
    redirect(paths.common.home);
  }
  return <Layout><ResetPasswordForm token={searchParams.code} /></Layout>;
};

export default Page;
