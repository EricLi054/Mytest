import type { Metadata } from "next";
import { clientEnv } from "#env/client";
import { getPageTitle } from "#utils/metadata";

import LapsedMembershipContainer from "./container";

export const metadata: Metadata = {
  title: getPageTitle("Sorry, your membership has lapsed"),
};

export default function MembershipLapsed() {
  return <LapsedMembershipContainer racHomePageUrl={clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL} />;
}
