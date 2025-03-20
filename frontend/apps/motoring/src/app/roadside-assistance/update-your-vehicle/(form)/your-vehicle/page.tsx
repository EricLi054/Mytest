import type { Metadata } from "next";
import Timeout from "#components/Timeout";
import { getContentfulFormPageData } from "#contentful/getFormPageData";
import { serverEnv } from "#env/server";
import { getPageTitle } from "#utils/metadata";

import { getUpdateYourVehicleTimeoutUrl } from "../../routing";
import { getUpdateYourVehicleSession } from "../../session";
import { YourVehicleContainer } from "./container";
import { YourVehicleContentfulSchema } from "./schema";

export const metadata: Metadata = {
  title: getPageTitle("Your vehicle"),
};

export const dynamic = "force-dynamic";

export default async function YourVehicle() {
  const { session, sessionTtl } = await getUpdateYourVehicleSession({ currentPage: "/your-vehicle" });
  const contentfulData = await getContentfulFormPageData({
    id: serverEnv().CONTENTFUL_YOUR_VEHICLE_ID,
    schema: YourVehicleContentfulSchema,
  });

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
