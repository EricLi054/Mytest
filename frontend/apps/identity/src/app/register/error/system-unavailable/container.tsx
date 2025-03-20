"use client";

import type { PropsWithRacHomePage } from "#types";
import { RacPhoneLink } from "#components/PhoneLink";
import RacHomeErrorPageButton from "#components/RacHomeErrorPageButton";

import { ErrorPage } from "@racwa/ui";

export default function SystemUnavailableContainer({ racHomePageUrl }: PropsWithRacHomePage) {
  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }}>
      <ErrorPage.Subheading>Something went wrong</ErrorPage.Subheading>
      <ErrorPage.Subtext>
        Please try again later or call us on <RacPhoneLink />.
      </ErrorPage.Subtext>
      <RacHomeErrorPageButton racHomePageUrl={racHomePageUrl} />
    </ErrorPage>
  );
}
