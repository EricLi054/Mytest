import type { Metadata } from "next";
import { RootContainer } from "#components/RootContainer";
import { clientEnv } from "#env/client";
import { getPageTitle } from "#utils/metadata";
import { getRegistrationSession } from "#utils/session";

import { matchFormAction } from "./actions";
import MatchForm from "./Form";
import { getRegistrationOtpVerificationDetails } from "./graphql/getRegistrationOtpVerificationDetails";
import { sendRegistrationOtp } from "./graphql/sendRegistrationOtp";
import { verifyRegistrationOtp } from "./graphql/verifyRegistrationOtp";
import { MfaModalDialogProvider } from "./providers/mfa";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getPageTitle("Let's confirm your details"),
};

export default async function MatchPage() {
  await getRegistrationSession({ currentPage: "/match" });

  return (
    <RootContainer>
      <MfaModalDialogProvider
        getVerificationDetailsAction={getRegistrationOtpVerificationDetails}
        sendOtpAction={sendRegistrationOtp}
        verifyOtpAction={verifyRegistrationOtp}
      >
        <MatchForm reCaptchaSiteKey={clientEnv().NEXT_PUBLIC_RECAPTCHA_SITE_KEY} formAction={matchFormAction} />
      </MfaModalDialogProvider>
    </RootContainer>
  );
}
