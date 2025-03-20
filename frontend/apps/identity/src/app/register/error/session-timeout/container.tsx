"use client";

import type { PropsWithRacHomePage } from "#types";
import RacHomeErrorPageButton from "#components/RacHomeErrorPageButton";

import { ErrorPage } from "@racwa/ui";

export default function SessionTimeoutContainer({ racHomePageUrl }: PropsWithRacHomePage) {
  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }}>
      <ErrorPage.Subheading>It looks like your page timed out</ErrorPage.Subheading>
      <ErrorPage.Subtext>Please try again.</ErrorPage.Subtext>
      <RacHomeErrorPageButton racHomePageUrl={racHomePageUrl} />
    </ErrorPage>
  );
}
