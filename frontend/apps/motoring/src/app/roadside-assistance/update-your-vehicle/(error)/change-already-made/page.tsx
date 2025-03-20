import type { Metadata } from "next";
import { getContentfulErrorPageData } from "#contentful/getErrorPageData";
import { clientEnv } from "#env/client";
import { serverEnv } from "#env/server";
import { getFooterProps } from "#utils/getFooterProps";
import { getPageTitle } from "#utils/metadata";

import ChangeAlreadyMadeContainer from "./container";

export const metadata: Metadata = {
  title: getPageTitle("Change already made"),
};

export const dynamic = "force-dynamic";

export default async function ChangeAlreadyMade() {
  const contentfulData = await getContentfulErrorPageData(serverEnv().CONTENTFUL_CHANGE_ALREADY_MADE_ID);

  return (
    <ChangeAlreadyMadeContainer
      racHomepageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}
      footerProps={getFooterProps()}
      contentfulData={contentfulData}
    />
  );
}
