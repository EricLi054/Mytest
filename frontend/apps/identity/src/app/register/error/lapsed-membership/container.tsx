"use client";

import { Typography } from "@mui/material";
import { RacPhoneLink } from "#components/PhoneLink";
import RacHomeErrorPageButton from "#components/RacHomeErrorPageButton";

import { ErrorPage } from "@racwa/ui";

import type { ErrorPageContainerProps } from "../types";

export default function LapsedMembershipContainer({ racHomePageUrl, footerProps }: ErrorPageContainerProps) {
  return (
    <ErrorPage
      heading="Sorry, your membership has lapsed"
      navBreadcrumbProps={{ homeLink: racHomePageUrl }}
      footerProps={footerProps}
    >
      <Typography sx={{ fontSize: "24px", fontWeight: 400 }}>To be a member...</Typography>
      <ErrorPage.Subtext>
        You must have insurance, Roadside Assistance, a loan, security monitoring or a Rewards membership with us.
      </ErrorPage.Subtext>
      <Typography sx={{ fontSize: "18px", fontWeight: 400 }}>
        If you've missed a payment or forgotten to renew, please call us on <RacPhoneLink />
      </Typography>
      <RacHomeErrorPageButton racHomePageUrl={racHomePageUrl} />
    </ErrorPage>
  );
}
