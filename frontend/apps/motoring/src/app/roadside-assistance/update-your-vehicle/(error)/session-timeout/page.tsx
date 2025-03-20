import type { Metadata } from "next";
import { clientEnv } from "#env/client";
import { getFooterProps } from "#utils/getFooterProps";
import { getPageTitle } from "#utils/metadata";

import SessionTimeoutContainer from "./container";
import DeleteCookie from "./DeleteCookie";

const pageTitleMap: Record<string, string> = {
  "/your-vehicle": "Your Vehicle",
  "/update-vehicle": "Update Vehicle",
  "/confirm-vehicle": "Confirm Vehicle",
  "/confirmation": "Confirmation",
};

const pageTitle = getPageTitle("Session timeout");

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pageTitle,
};

type SearchParams = Promise<{ previousPage: string | undefined }>;

export default async function SessionTimeout({ searchParams }: { searchParams: SearchParams }) {
  const { previousPage } = await searchParams;
  const previousPageTitle = previousPage ? pageTitleMap[String(previousPage)] : undefined;
  const gtmPageTitle = previousPageTitle ? `Session timeout - previous page: ${previousPageTitle}` : pageTitle;

  return (
    <>
      <SessionTimeoutContainer
        racHomepageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL}
        footerProps={getFooterProps()}
        gtmPageTitle={gtmPageTitle}
      />
      <DeleteCookie />
    </>
  );
}
