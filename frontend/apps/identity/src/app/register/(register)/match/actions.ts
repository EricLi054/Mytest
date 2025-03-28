"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { trace } from "@opentelemetry/api";
import { matchSchema } from "#app/register/(register)/match/schema";
import { serverEnv } from "#env/server";
import { annotatedLog } from "#utils/logging";
import { getRegistrationErrorPageUrl } from "#utils/routing";
import { getRegistrationSession, MAX_MATCH_ATTEMPTS, updateRegistrationSession } from "#utils/session";
import { z } from "zod";

import type { GetMatchedPersonDataParams } from "./data";
import type { PersonMatchError } from "./types";
import { getMatchedPersonData } from "./data";
import { IdentificationMethod, LapsedMembershipStatus } from "./types";

export type MatchFormAction = typeof matchFormAction;
const ReCaptchaResponseSchema = z.object({
  success: z.boolean(),
  score: z.number().default(-1),
  "error-codes": z.array(z.string()).optional(),
});

/**
 * Validate the reCAPTCHA token and whether the client's session has a suitable score
 * @param reCaptchaToken the token
 * @param log a logging function
 * @returns whether the reCAPTCHA token is valid
 */
async function validateReCaptchaToken(reCaptchaToken: string, log: (message: string) => void): Promise<boolean> {
  try {
    log("Validating reCAPTCHA token");

    const secretKey = serverEnv().RECAPTCHA_SITE_SECRET;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${reCaptchaToken}`;
    const response = await fetch(url, { method: "POST" });

    if (!response.ok) {
      log(`Failed to get reCAPTCHA result: ${response.status} ${response.statusText}`);
      return false;
    }

    const reCaptchaResponse = ReCaptchaResponseSchema.safeParse(await response.json());
    if (!reCaptchaResponse.success || !reCaptchaResponse.data.success || reCaptchaResponse.data.score < 0.5) {
      log(`Invalid reCAPTCHA response: ${JSON.stringify(reCaptchaResponse)}`);
      return false;
    } else {
      log(`Valid reCAPTCHA response: ${JSON.stringify(reCaptchaResponse)}`);
      return true;
    }
  } catch (error) {
    log(`Error checking reCAPTCHA token: ${error as Error}`);
    console.error(error);
    return false;
  }
}

export async function matchFormAction(_: unknown, formData: FormData, recaptchaToken: string) {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("match-form-submit-span");
  const session = await getRegistrationSession({ currentPage: "/match" });

  const log = (message: string) => annotatedLog("matchFormAction", message, session.id, session.person?.personId);

  const hasValidReCaptchaToken = await validateReCaptchaToken(recaptchaToken, log);
  if (!hasValidReCaptchaToken) {
    return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  }

  if (session.person) {
    span.end();
    return redirect(getRegistrationErrorPageUrl({ page: "/already-matched" }));
  }

  if (session.incorrectMatchAttempts >= MAX_MATCH_ATTEMPTS) {
    log(`Member has had too many incorrect attempts: ${session.incorrectMatchAttempts}`);
    span.end();
    return redirect(getRegistrationErrorPageUrl({ page: "/cant-find-you" }));
  }

  log("Submitting match form");
  const submission = parseWithZod(formData, { schema: matchSchema });

  if (submission.status !== "success") {
    log("Form data invalid");
    span.end();
    return submission.reply();
  }

  session.steps.match = submission.value;

  // Create query parameters based on the identification method
  const queryParameters: GetMatchedPersonDataParams = {
    input: {
      request: {
        firstName: submission.value.firstName,
        dateOfBirth: submission.value.dateOfBirth,
        surname: submission.value.lastName,
      },
    },
  };
  switch (submission.value.identificationMethod) {
    case IdentificationMethod.Mobile:
      queryParameters.input.request.mobilePhone = submission.value.mobileNumber;
      break;
    case IdentificationMethod.Membership:
      queryParameters.input.request.racId = submission.value.membershipNumber;
      break;
    default:
      queryParameters.input.request.productNumber = submission.value.policyNumber;
      break;
  }

  const { data, errors } = await getMatchedPersonData(queryParameters);

  if (errors) {
    log(`Failed to match, unhandled exception: ${JSON.stringify(errors, null, 2)}`);
    span.end();
    return redirect(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  }

  if (data.match.errors) {
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

    for (const error of data.match.errors) {
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
  } else if (data.match.matchedPerson) {
    session.person = data.match.matchedPerson;

    log("Successfully matched member");
    await updateRegistrationSession({ session });

    if (data.match.matchedPerson.membershipType === LapsedMembershipStatus) {
      log("Matched member has a lapsed membership");
      span.end();
      // TODO - Need to terminate the session here or in the error page so user cannot navigate back to the match page after an error
      return redirect(getRegistrationErrorPageUrl({ page: "/lapsed-membership" }));
    }

    log("Returning successful submission reply to open MFA dialog to authenticate matched member");
    span.end();
    return submission.reply();
  } else {
    log("Unexpected error occurred");
    span.end();
    return submission.reply({ formErrors: ["Unexpected Error"] });
  }
}
