"use client";

import RacHomeErrorPageButton from "#components/RacHomeErrorPageButton";

import { ErrorPage } from "@racwa/ui";

import type { ErrorPageContainerProps } from "../types";

export default function SessionTimeoutContainer({ racHomePageUrl, footerProps }: ErrorPageContainerProps) {
  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }} footerProps={footerProps}>
      <ErrorPage.Subheading>It looks like your page timed out</ErrorPage.Subheading>
      <ErrorPage.Subtext>Please try again.</ErrorPage.Subtext>
      <RacHomeErrorPageButton racHomePageUrl={racHomePageUrl} />
    </ErrorPage>
  );
}
