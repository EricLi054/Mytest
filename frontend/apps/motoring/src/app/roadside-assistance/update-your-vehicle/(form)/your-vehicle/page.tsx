import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Timeout from "#components/Timeout";
import { getContentfulFormPageData } from "#contentful/getFormPageData";
import { serverEnv } from "#env/server";
import { getSessionIds } from "#utils/getSessionIds";
import { getPageTitle } from "#utils/metadata";

import { getUpdateYourVehiclePageUrl, getUpdateYourVehicleTimeoutUrl } from "../../routing";
import { getUpdateYourVehicleSession } from "../../UpdateYourVehicleSession";
import { YourVehicleContainer } from "./container";
import { YourVehicleContentfulSchema } from "./schema";

export const metadata: Metadata = {
  title: getPageTitle("Your vehicle"),
};

export const dynamic = "force-dynamic";

export default async function YourVehicle() {
  const sessionIdsResult = await getSessionIds({ cookieName: "rac-motoring-uyv-session-id" });

  if (!sessionIdsResult.success) {
    redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  const { crmId, sessionId } = sessionIdsResult;

  const getSessionResult = await getUpdateYourVehicleSession({ currentPage: "/your-vehicle", crmId, sessionId });

  if (!getSessionResult.success) {
    redirect(getUpdateYourVehiclePageUrl({ page: getSessionResult.redirectTo }));
  }

  const contentfulData = await getContentfulFormPageData({
    id: serverEnv().CONTENTFUL_YOUR_VEHICLE_ID,
    schema: YourVehicleContentfulSchema,
  });

  const { session, sessionTtl } = getSessionResult;

  return (
    <>
      <YourVehicleContainer formValues={session.steps.yourVehicle} contentfulData={contentfulData} />
      <Timeout
        sessionTtl={sessionTtl}
        sessionTimeoutUrl={getUpdateYourVehicleTimeoutUrl({ previousPage: "/your-vehicle" })}
      />
    </>
  );
}
