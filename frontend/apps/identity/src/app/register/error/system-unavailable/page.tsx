import type { Metadata } from "next";
import { clientEnv } from "#env/client";
import { getPageTitle } from "#utils/metadata";

import SystemUnavailableContainer from "./container";

export const metadata: Metadata = {
  title: getPageTitle("System unavailable"),
};

export const dynamic = "force-dynamic";

export default function SystemUnavailable() {
  return <SystemUnavailableContainer racHomePageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL} />;
}
