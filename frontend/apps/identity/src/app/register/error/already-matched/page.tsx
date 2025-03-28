import type { Metadata } from "next";
import { clientEnv } from "#env/client";
import { getFooterProps } from "#utils/getFooterProps";
import { getPageTitle } from "#utils/metadata";

import AlreadyMatchedContainer from "./container";

export const metadata: Metadata = {
  title: getPageTitle("Already matched"),
};

export const dynamic = "force-dynamic";

export default function AlreadyMatched() {
  return (
    <AlreadyMatchedContainer
      myRacLoginPageUrl={clientEnv().NEXT_PUBLIC_MYRAC_LOGIN_PAGE_URL}
      racHomePageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}
      footerProps={getFooterProps()}
    />
  );
}
