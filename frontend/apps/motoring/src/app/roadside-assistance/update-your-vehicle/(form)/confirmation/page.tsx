import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Timeout from "#components/Timeout";
import { getContentfulConfirmationPageData } from "#contentful/getConfirmationPageData";
import { clientEnv } from "#env/client";
import { serverEnv } from "#env/server";
import { getPageTitle } from "#utils/metadata";

import { getMyRacUrl, getUpdateYourVehiclePageUrl, getUpdateYourVehicleTimeoutUrl } from "../../routing";
import { getUpdateYourVehicleSession } from "../../session";
import { ConfirmationContainer } from "./container";
import { ConfirmationPageSchema } from "./schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Confirmation"),
};

export default async function Confirmation() {
  const { session, sessionTtl } = await getUpdateYourVehicleSession({ currentPage: "/confirmation" });
  const contentfulData = await getContentfulConfirmationPageData(
    serverEnv().CONTENTFUL_CONFIRMATION_ID,
    ConfirmationPageSchema,
  );

  if (!session.searchedVehicleDetails) {
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

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
