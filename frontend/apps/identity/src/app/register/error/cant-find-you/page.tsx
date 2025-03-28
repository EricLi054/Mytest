import type { Metadata } from "next";
import { clientEnv } from "#env/client";
import { getFooterProps } from "#utils/getFooterProps";
import { getPageTitle } from "#utils/metadata";

import CantFindYouContainer from "./container";

export const metadata: Metadata = {
  title: getPageTitle("Can't find you"),
};

export const dynamic = "force-dynamic";

export default function CantFindYou() {
  return (
    <CantFindYouContainer racHomePageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL} footerProps={getFooterProps()} />
  );
}
