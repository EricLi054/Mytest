"use client";

import { useEffect } from "react";
import { logEvent, logPageView } from "#utils/analyticsTagging";

import type { FooterProps } from "@racwa/react-components";
import { ErrorPage, StyledLink } from "@racwa/ui";

import { getMyRacUrl } from "../../routing";

export type SystemUnavailableContainerProps = {
  racHomePageUrl: string;
  footerProps: FooterProps;
};

export default function SystemUnavailableContainer({ racHomePageUrl, footerProps }: SystemUnavailableContainerProps) {
  useEffect(logPageView, []);

  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }} footerProps={footerProps}>
      <ErrorPage.Subheading>Something went wrong</ErrorPage.Subheading>
      <ErrorPage.Subtext>
        Please try again later or call us on <StyledLink href="tel:131703">13 17 03</StyledLink>.
      </ErrorPage.Subtext>
      <ErrorPage.Button href={getMyRacUrl(racHomePageUrl)} onClick={() => logEvent("Back to myRAC")}>
        Back to myRAC
      </ErrorPage.Button>
    </ErrorPage>
  );
}
