"use client";

import { ErrorPage } from "@racwa/ui";

// not-found.tsx is built statically at build time, this requires using PRD values directly
const racHomePageUrl = "https://rac.com.au";

export default function NotFound() {
  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }}>
      <ErrorPage.Subheading>We seem to be missing some parts</ErrorPage.Subheading>
      <ErrorPage.Subtext>Sorry, we can't find the page that you're looking for.</ErrorPage.Subtext>
      <ErrorPage.Button href={`${racHomePageUrl}`}>Back to RAC</ErrorPage.Button>
    </ErrorPage>
  );
}
