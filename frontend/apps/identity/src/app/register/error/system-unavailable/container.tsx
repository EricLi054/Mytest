"use client";

import { RacPhoneLink } from "#components/PhoneLink";
import RacHomeErrorPageButton from "#components/RacHomeErrorPageButton";

import { ErrorPage } from "@racwa/ui";

import type { ErrorPageContainerProps } from "../types";

export default function SystemUnavailableContainer({ racHomePageUrl, footerProps }: ErrorPageContainerProps) {
  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }} footerProps={footerProps}>
      <ErrorPage.Subheading>Something went wrong</ErrorPage.Subheading>
      <ErrorPage.Subtext>
        Please try again later or call us on <RacPhoneLink />.
      </ErrorPage.Subtext>
      <RacHomeErrorPageButton racHomePageUrl={racHomePageUrl} />
    </ErrorPage>
  );
}
