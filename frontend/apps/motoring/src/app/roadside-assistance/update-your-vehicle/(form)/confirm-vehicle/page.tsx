import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Timeout from "#components/Timeout";
import { getContentfulFormPageData } from "#contentful/getFormPageData";
import { serverEnv } from "#env/server";
import { getSessionIds } from "#utils/getSessionIds";
import { getVehicleCardInfo } from "#utils/getVehicleCardInfo";
import { getPageTitle } from "#utils/metadata";

import { getUpdateYourVehiclePageUrl, getUpdateYourVehicleTimeoutUrl } from "../../routing";
import { getUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { confirmVehicle } from "./actions";
import { ConfirmVehicleContainer } from "./container";
import { ConfirmVehicleContentfulSchema } from "./schema";

export const metadata: Metadata = {
  title: getPageTitle("Confirm vehicle"),
};

export const dynamic = "force-dynamic";

export default async function ConfirmVehicle() {
  const sessionIdsResult = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

  if (!sessionIdsResult.success) {
    redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const { crmId, sessionId } = sessionIdsResult;

  const getSessionResult = await getUpdateYourVehicleSession({ currentPage: "/confirm-vehicle", crmId, sessionId });

  if (!getSessionResult.success) {
    redirect(getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }));
  }

  const { session, sessionTtl } = getSessionResult;

  if (!session.steps.updateVehicle || !session.searchedVehicleDetails) {
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const {
    searchedVehicleDetails,
    steps: {
      updateVehicle: { vehicleColour, vehicleRego },
    },
  } = session;

  const vehicleCardInfo = getVehicleCardInfo(searchedVehicleDetails);

  if (!vehicleCardInfo.success) {
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const contentfulData = await getContentfulFormPageData({
    id: serverEnv().CONTENTFUL_CONFIRM_VEHICLE_ID,
    schema: ConfirmVehicleContentfulSchema,
  });

  return (
    <>
      <ConfirmVehicleContainer
        vehicleCardInfo={{
          ...vehicleCardInfo,
          colour: vehicleColour,
          registration: vehicleRego,
          vehicleType: searchedVehicleDetails.vehicleType,
        }}
        contentfulData={contentfulData}
        confirmVehicleAction={confirmVehicle}
      />
      <Timeout
        sessionTtl={sessionTtl}
        sessionTimeoutUrl={getUpdateYourVehicleTimeoutUrl({ previousPage: "/confirm-vehicle" })}
      />
    </>
  );
}
