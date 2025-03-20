"use client";

import { useEffect } from "react";
import { logEvent, logPageView } from "#utils/analyticsTagging";

import type { FooterProps } from "@racwa/react-components";
import { ErrorPage } from "@racwa/ui";

import { getMyRacUrl } from "../../routing";

type SessionTimeoutContainerProps = {
  racHomepageUrl: string;
  footerProps: FooterProps;
  gtmPageTitle: string;
};

export default function SessionTimeoutContainer({
  racHomepageUrl,
  footerProps,
  gtmPageTitle,
}: SessionTimeoutContainerProps) {
  useEffect(() => logPageView(gtmPageTitle), [gtmPageTitle]);

  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomepageUrl }} footerProps={footerProps}>
      <ErrorPage.Subheading>It looks like your page timed out</ErrorPage.Subheading>
      <ErrorPage.Subtext>Please try again.</ErrorPage.Subtext>
      <ErrorPage.Button href={getMyRacUrl(racHomepageUrl)} onClick={() => logEvent("Back to myRAC")}>
        Back to myRAC
      </ErrorPage.Button>
    </ErrorPage>
  );
}
