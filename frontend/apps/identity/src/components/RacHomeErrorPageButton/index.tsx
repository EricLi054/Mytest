import type { PropsWithRacHomePage } from "#types";
import { logCustomEvent } from "#utils/analyticsTagging";

import { ErrorPage } from "@racwa/ui";

export default function RacHomeErrorPageButton({ racHomePageUrl }: PropsWithRacHomePage) {
  return (
    <ErrorPage.Button href={racHomePageUrl} onClick={() => logCustomEvent("RAC homepage")}>
      RAC homepage
    </ErrorPage.Button>
  );
}
