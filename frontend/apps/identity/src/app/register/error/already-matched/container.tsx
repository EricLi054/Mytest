"use client";

import { logCustomEvent } from "#utils/analyticsTagging";

import { ErrorPage } from "@racwa/ui";

import type { ErrorPageContainerProps } from "../types";

export type AlreadyMatchedContainerProps = { myRacLoginPageUrl: string } & ErrorPageContainerProps;

export default function AlreadyMatchedContainer({
  myRacLoginPageUrl,
  racHomePageUrl,
  footerProps,
}: AlreadyMatchedContainerProps) {
  const buttonText = "Log in or register";
  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }} footerProps={footerProps}>
      <ErrorPage.Subheading>Something went wrong</ErrorPage.Subheading>
      <ErrorPage.Subtext>Please try again.</ErrorPage.Subtext>
      <ErrorPage.Button href={myRacLoginPageUrl} onClick={() => logCustomEvent(buttonText)}>
        {buttonText}
      </ErrorPage.Button>
    </ErrorPage>
  );
}
