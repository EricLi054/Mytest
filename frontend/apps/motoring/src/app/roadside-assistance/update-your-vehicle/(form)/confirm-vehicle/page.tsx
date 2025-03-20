import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Timeout from "#components/Timeout";
import { getContentfulFormPageData } from "#contentful/getFormPageData";
import { serverEnv } from "#env/server";
import { getVehicleCardInfo } from "#utils/getVehicleCardInfo";
import { getPageTitle } from "#utils/metadata";

import { getUpdateYourVehiclePageUrl, getUpdateYourVehicleTimeoutUrl } from "../../routing";
import { getUpdateYourVehicleSession } from "../../session";
import { confirmVehicle } from "./actions";
import { ConfirmVehicleContainer } from "./container";
import { ConfirmVehicleContentfulSchema } from "./schema";

export const metadata: Metadata = {
  title: getPageTitle("Confirm vehicle"),
};

export const dynamic = "force-dynamic";

export default async function ConfirmVehicle() {
  const { session, sessionTtl } = await getUpdateYourVehicleSession({ currentPage: "/confirm-vehicle" });

  const contentfulData = await getContentfulFormPageData({
    id: serverEnv().CONTENTFUL_CONFIRM_VEHICLE_ID,
    schema: ConfirmVehicleContentfulSchema,
  });

  const searchedVehicleDetails = session.searchedVehicleDetails;
  const vehicleColour = session.steps.updateVehicle?.vehicleColour;
  const vehicleRego = session.steps.updateVehicle?.vehicleRego;

  if (!searchedVehicleDetails || !vehicleColour || !vehicleRego) {
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const vehicleCardInfo = getVehicleCardInfo(searchedVehicleDetails);

  if (!vehicleCardInfo.success) {
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

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
