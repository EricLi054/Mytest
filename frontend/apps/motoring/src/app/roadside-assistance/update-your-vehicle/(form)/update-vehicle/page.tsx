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
import UpdateVehicleContainer from "./container";
import { UpdateVehicleContentfulSchema } from "./schema";

export const metadata: Metadata = {
  title: getPageTitle("Update vehicle"),
};

export const dynamic = "force-dynamic";

export default async function UpdateVehicle() {
  const sessionIdsResult = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

  if (!sessionIdsResult.success) {
    redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const { crmId, sessionId } = sessionIdsResult;

  const getSessionResult = await getUpdateYourVehicleSession({ currentPage: "/update-vehicle", crmId, sessionId });

  if (!getSessionResult.success) {
    redirect(getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }));
  }

  const contentfulData = await getContentfulFormPageData({
    id: serverEnv().CONTENTFUL_UPDATE_VEHICLE_ID,
    schema: UpdateVehicleContentfulSchema,
  });

  const { session, sessionTtl } = getSessionResult;

  const vehicleCardInfo =
    session.searchedVehicleDetails && session.steps.updateVehicle
      ? getVehicleCardInfo(session.searchedVehicleDetails)
      : undefined;

  if (vehicleCardInfo !== undefined && !vehicleCardInfo.success) {
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  return (
    <>
      <UpdateVehicleContainer
        contentfulData={contentfulData}
        formValues={{ formData: session.steps.updateVehicle, vehicleCardInfo }}
      />
      <Timeout
        sessionTtl={sessionTtl}
        sessionTimeoutUrl={getUpdateYourVehicleTimeoutUrl({ previousPage: "/update-vehicle" })}
      />
    </>
  );
}
