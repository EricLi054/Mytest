import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Timeout from "#components/Timeout";
import { getContentfulConfirmationPageData } from "#contentful/getConfirmationPageData";
import { clientEnv } from "#env/client";
import { serverEnv } from "#env/server";
import { getSessionIds } from "#utils/getSessionIds";
import { getPageTitle } from "#utils/metadata";

import { getMyRacUrl, getUpdateYourVehiclePageUrl, getUpdateYourVehicleTimeoutUrl } from "../../routing";
import { getUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { ConfirmationContainer } from "./container";
import { ConfirmationPageSchema } from "./schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Confirmation"),
};

export default async function Confirmation() {
  const sessionIdsResult = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

  if (!sessionIdsResult.success) {
    redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const { crmId, sessionId } = sessionIdsResult;

  const getSessionResult = await getUpdateYourVehicleSession({ currentPage: "/confirmation", crmId, sessionId });

  if (!getSessionResult.success) {
    redirect(getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }));
  }

  const { session, sessionTtl } = getSessionResult;

  if (!session.searchedVehicleDetails) {
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const contentfulData = await getContentfulConfirmationPageData(
    serverEnv().CONTENTFUL_CONFIRMATION_ID,
    ConfirmationPageSchema,
  );

  return (
    <>
      <ConfirmationContainer
        firstName={session.firstName}
        vehicleType={session.searchedVehicleDetails.vehicleType}
        myRacUrl={getMyRacUrl(clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL)}
        contentfulData={contentfulData}
      />
      <Timeout
        sessionTtl={sessionTtl}
        sessionTimeoutUrl={getUpdateYourVehicleTimeoutUrl({ previousPage: "/confirmation" })}
      />
    </>
  );
}
