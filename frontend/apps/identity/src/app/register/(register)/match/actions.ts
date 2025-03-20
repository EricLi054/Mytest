"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { trace } from "@opentelemetry/api";
import { matchSchema } from "#app/register/(register)/match/schema";
import { annotatedLog } from "#utils/logging";
import { getRegistrationErrorPageUrl } from "#utils/routing";
import { getRegistrationSession, MAX_MATCH_ATTEMPTS, updateRegistrationSession } from "#utils/session";

import { createMfaSessionKey, MfaJourneyType } from "@racwa/mfa";

import type { GetMatchedPersonDataParams } from "./data";
import type { PersonMatchError } from "./types";
import { getMatchedPersonData } from "./data";
import { IdentificationMethod, LapsedMembershipStatus } from "./types";

export type MatchFormAction = typeof matchFormAction;

export async function matchFormAction(_: unknown, formData: FormData) {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("match-form-submit-span");
  const session = await getRegistrationSession({ currentPage: "/match" });

  const log = (message: string) => annotatedLog("matchFormAction", message, session.id, session.person?.personId);

  log("Submitting match form");
  const submission = parseWithZod(formData, { schema: matchSchema });

  if (submission.status !== "success") {
    log("Form data invalid");
    span.end();
    return submission.reply();
  }

  if (session.incorrectMatchAttempts >= MAX_MATCH_ATTEMPTS) {
    log(`Member has had too many incorrect attempts: ${session.incorrectMatchAttempts}`);
    span.end();
    return redirect(getRegistrationErrorPageUrl({ page: "/cant-find-you" }));
  }

  // TODO - DED-1296 - Should a property be added to the session to check if MFA has been completed or erred and handle appropriately? If so, TTL of the session needs to be considered so that they do not stay authenticated outside the 10 min OTP Service authenticated timeframe

  const data = submission.value;
  session.steps.match = data;

  const mfaSessionKey = createMfaSessionKey(MfaJourneyType.AccountRegistration, session.id ?? "");

  // Create query parameters based on the identification method
  const queryParameters: GetMatchedPersonDataParams = {
    input: {
      request: {
        firstName: data.firstName,
        dateOfBirth: data.dateOfBirth,
        surname: data.lastName,
      },
    },
    sessionKey: mfaSessionKey,
  };
  switch (data.identificationMethod) {
    case IdentificationMethod.Mobile:
      queryParameters.input.request.mobilePhone = data.mobileNumber;
      break;
    case IdentificationMethod.Membership:
      queryParameters.input.request.racId = data.membershipNumber;
      break;
    default:
      queryParameters.input.request.productNumber = data.policyNumber;
      break;
  }

  const {
    data: { match },
    errors,
  } = await getMatchedPersonData(queryParameters);

  if (errors) {
    log(`Failed to match, unhandled exception: ${JSON.stringify(errors, null, 2)}`);
    span.end();
    return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  }

  if (match.errors) {
    session.incorrectMatchAttempts += 1;
    if (session.incorrectMatchAttempts >= MAX_MATCH_ATTEMPTS) {
      log(`Member has had too many incorrect attempts: ${session.incorrectMatchAttempts}`);
      await updateRegistrationSession({ session });
      span.end();
      return redirect(getRegistrationErrorPageUrl({ page: "/cant-find-you" }));
    }

    const handleUpdateSession = async (error: PersonMatchError) => {
      log(`Error: ${error} - Updating session with incorrect match attempts: ${session.incorrectMatchAttempts}`);
      await updateRegistrationSession({ session });
      span.end();
      return submission.reply({ formErrors: [error] });
    };

    for (const error of match.errors) {
      switch (error.type) {
        case "NoMatchError":
          return await handleUpdateSession("NoMatchError");
        case "DuplicateMatchError":
          return await handleUpdateSession("DuplicateMatchError");
        default:
          log("Failed to match, received a unexpected error response");
          span.end();
          // TODO - Need to terminate the session here or in the error page so user cannot navigate back to the match page after an error
          return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
      }
    }
  } else if (match.matchedPerson) {
    session.person = match.matchedPerson;

    if (match.matchedPerson.membershipType === LapsedMembershipStatus) {
      log("Matched member has a lapsed membership");
      span.end();
      // TODO - Need to terminate the session here or in the error page so user cannot navigate back to the match page after an error
      return redirect(getRegistrationErrorPageUrl({ page: "/lapsed-membership" }));
    }

    log("Successfully matched member");
    await updateRegistrationSession({ session });

    // TODO - DED-1296 - What should happen if the OtpVerificationDetails on matched person is null or OtpVerificationDetails.isAuthenticated is true?

    log("Returning successful submission reply to open MFA dialog to authenticate matched member");
    span.end();
    return submission.reply();
  } else {
    log("Unexpected error occurred");
    span.end();
    return submission.reply({ formErrors: ["Unexpected Error"] });
  }
}
