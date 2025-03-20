"use client";

import { ErrorPage } from "@racwa/ui";

// not-found.tsx is built statically at build time, this requires using PRD values directly
const racHomePageUrl = "https://rac.com.au";

export default function NotFound() {
  return (
    <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }}>
      <ErrorPage.Subheading>Sorry, we can't find that page</ErrorPage.Subheading>
      <ErrorPage.Button href={`${racHomePageUrl}/myrac`}>Back to myRAC</ErrorPage.Button>
    </ErrorPage>
  );
}
