import * as React from "react";
import type { Metadata } from "next";

import { config } from "@/config";
import { Layout } from "@/components/auth/layout";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: `Sign in | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <SignInForm />
    </Layout>
  );
}
