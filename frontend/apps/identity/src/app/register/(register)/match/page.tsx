import type { Metadata } from "next";
import { RootContainer } from "#components/RootContainer";
import { getPageTitle } from "#utils/metadata";
import { getRegistrationSession } from "#utils/session";

import { matchFormAction } from "./actions";
import MatchForm from "./Form";
import { checkAndSendRegistrationOtp } from "./graphql/checkAndSendRegistrationOtp";
import { checkAndVerifyRegistrationOtp } from "./graphql/checkAndVerifyRegistrationOtp";
import { checkRegistrationOtp } from "./graphql/checkRegistrationOtp";
import { MfaModalDialogProvider } from "./providers/mfa";
import { getMatchedPerson } from "./utils/mfa";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Let's confirm your details"),
};

export default async function MatchPage() {
  await getRegistrationSession({ currentPage: "/match" });

  return (
    <RootContainer>
      <MfaModalDialogProvider
        getPerson={getMatchedPerson}
        checkOtp={checkRegistrationOtp}
        checkAndSendOtp={checkAndSendRegistrationOtp}
        checkAndVerifyOtp={checkAndVerifyRegistrationOtp}
      >
        <MatchForm formAction={matchFormAction} />
      </MfaModalDialogProvider>
    </RootContainer>
  );
}
