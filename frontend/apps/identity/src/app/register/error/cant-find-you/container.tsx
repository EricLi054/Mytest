"use client";

import type { PropsWithRacHomePage } from "#types";
import { Typography } from "@mui/material";
import { RegistrationPhoneLink } from "#components/PhoneLink";
import RacHomeErrorPageButton from "#components/RacHomeErrorPageButton";

import { ErrorPage } from "@racwa/ui";

export default function CantFindYouContainer({ racHomePageUrl }: PropsWithRacHomePage) {
  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }}>
      <ErrorPage.Subheading>Sorry, we couldn't find you</ErrorPage.Subheading>
      <Typography sx={{ fontSize: "24px", fontWeight: 400 }}>To be a member...</Typography>
      <ErrorPage.Subtext>
        You must have insurance, Roadside Assistance, a loan, security monitoring or a Rewards membership with us.
      </ErrorPage.Subtext>
      <ErrorPage.Subtext>
        If you're still having issues, please call us on <RegistrationPhoneLink />.
      </ErrorPage.Subtext>
      <RacHomeErrorPageButton racHomePageUrl={racHomePageUrl} />
    </ErrorPage>
  );
}
