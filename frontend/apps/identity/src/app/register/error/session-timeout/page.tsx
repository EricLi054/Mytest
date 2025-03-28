import type { Metadata } from "next";
import ClearSession from "#components/ClearSession";
import { clientEnv } from "#env/client";
import { getFooterProps } from "#utils/getFooterProps";
import { getPageTitle } from "#utils/metadata";

import SessionTimeoutContainer from "./container";

export const metadata: Metadata = {
  title: getPageTitle("Session timeout"),
};

export const dynamic = "force-dynamic";

export default function SessionTimeout() {
  return (
    <>
      <ClearSession />
      <SessionTimeoutContainer
        racHomePageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}
        footerProps={getFooterProps()}
      />
    </>
  );
}
