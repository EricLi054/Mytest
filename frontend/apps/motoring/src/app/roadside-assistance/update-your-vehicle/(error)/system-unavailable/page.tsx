import type { Metadata } from "next";
import { clientEnv } from "#env/client";
import { getFooterProps } from "#utils/getFooterProps";
import { getPageTitle } from "#utils/metadata";

import SystemUnavailableContainer from "./container";

export const metadata: Metadata = {
  title: getPageTitle("System unavailable"),
};

export const dynamic = "force-dynamic";

export default function SystemUnavailable() {
  return (
    <SystemUnavailableContainer
      racHomePageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}
      footerProps={getFooterProps()}
    />
  );
}
