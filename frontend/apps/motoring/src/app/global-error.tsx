"use client";

import { RacwaThemeProvider } from "@racwa/react-components";
import { ErrorPage, StyledLink } from "@racwa/ui";

// global-error.tsx is built statically at build time, this requires using PRD values directly
const racHomePageUrl = "https://rac.com.au";

// This won't appear during local development until we're using NextJS v15
// see: https://github.com/vercel/next.js/pull/75101
export default function GlobalError() {
  return (
    <html lang="en">
      <body style={{ height: "100vh" }}>
        <RacwaThemeProvider>
          <ErrorPage navBreadcrumbProps={{ homeLink: racHomePageUrl }}>
            <ErrorPage.Subheading>Something went wrong</ErrorPage.Subheading>
            <ErrorPage.Subtext>
              Please try again later or call us on <StyledLink href="tel:131703">13 17 03</StyledLink>.
            </ErrorPage.Subtext>
            <ErrorPage.Button href={`${racHomePageUrl}/myrac`}>Back to myRAC</ErrorPage.Button>
          </ErrorPage>
        </RacwaThemeProvider>
      </body>
    </html>
  );
}
