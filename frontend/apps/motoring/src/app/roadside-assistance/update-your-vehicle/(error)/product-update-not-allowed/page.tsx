import type { Metadata } from "next";
import { getContentfulErrorPageData } from "#contentful/getErrorPageData";
import { clientEnv } from "#env/client";
import { serverEnv } from "#env/server";
import { getFooterProps } from "#utils/getFooterProps";
import { getPageTitle } from "#utils/metadata";

import ProductUpdateNotAllowedContainer from "./container";

export const metadata: Metadata = {
  title: getPageTitle("Product update not allowed"),
};

export const dynamic = "force-dynamic";

export default async function ProductUpdateNotAllowed() {
  const contentfulData = await getContentfulErrorPageData(serverEnv().CONTENTFUL_UPDATE_NOT_ALLOWED_ID);

  return (
    <ProductUpdateNotAllowedContainer
      racHomepageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}
      footerProps={getFooterProps()}
      contentfulData={contentfulData}
    />
  );
}
