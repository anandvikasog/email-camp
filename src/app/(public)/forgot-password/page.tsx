import * as React from "react";
import type { Metadata } from "next";

import { config } from "@/config";
import { Layout } from "@/components/auth/layout";
import { ForgetPasswordForm } from "@/components/auth/forget-password-form";

export const metadata = {
  title: `Forget password | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <ForgetPasswordForm />
    </Layout>
  );
}
