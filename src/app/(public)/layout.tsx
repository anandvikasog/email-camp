import { authOptions } from "@/lib/nextAuth/authOptions";
import { paths } from "@/paths";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
// import { redirect } from "next/navigation";

// import { paths } from "@/paths";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(paths.private.dashboard);
  }

  return <>{children}</>;
}
