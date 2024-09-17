"use client";

import FullscreenLoader from "@/components/common/fullscreen-loader";
import { paths } from "@/paths";
import { useRouter } from "next/navigation";

const Error = () => {
  const router = useRouter();
  router.push(paths.common.error);

  return <FullscreenLoader title="Loading" />;
};

export default Error;
