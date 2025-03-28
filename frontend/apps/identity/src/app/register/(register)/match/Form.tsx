"use client";

import { useActionState, useEffect } from "react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Box, Button, FormControl, FormHelperText, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import CancelLink from "#components/CancelLink";
import Container from "#components/Container";
import { RegistrationPhoneLink } from "#components/PhoneLink";
import RacLogo from "#components/RacLogo/index";
import ReCaptcha, { getReCaptchaToken } from "#components/ReCaptcha";
import { logCustomEvent, logFieldTouched } from "#utils/analyticsTagging";
import {
  DATE_STRING_FORMAT,
  FORMATTED_DATE_STRING_REGEX,
  MAX_FIRST_NAME_LENGTH,
  MAX_INSURANCE_POLICY_NUMBER_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MAX_MEMBERSHIP_NUMBER_LENGTH,
  NON_NUMERIC_REGEX,
  RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT,
  REQUIRED_ERROR_MESSAGE,
} from "#utils/constants";
import { parse } from "date-fns";
import { signIn } from "next-auth/react";

import { useMfaModalDialog } from "@racwa/mfa";
import { RacwaCardNotification, RacwaDateField, RacwaLoadingModal, RacwaTextInput } from "@racwa/react-components";

import type { MatchFormAction } from "./actions";
import type { PersonMatchError } from "./types";
import IdentificationMethodRadioGroup from "./components/IdentificationMethodRadioGroup";
import IdentificationMethodRadioItem from "./components/IdentificationMethodRadioItem";
import { matchSchema } from "./schema";
import { IdentificationMethod } from "./types";

/** Maximum first name length to display in loading modal message */
const MAX_NAME_LENGTH = 15;

export type MatchFormProps = {
  formAction: MatchFormAction;
  reCaptchaSiteKey: string;
};

export default function MatchForm({ formAction, reCaptchaSiteKey }: MatchFormProps) {
  const firstNameInputId = "first-name-input";
  const lastNameInputId = "last-name-input";
  const dateOfBirthInputId = "date-of-birth-input";
  const mobileNumberInputId = "mobile-number-input";
  const membershipNumberInputId = "membership-number-input";
  const policyNumberInputId = "policy-number-input";
  const defaultIdentificationMethod = IdentificationMethod.Mobile;

  const onSubmit = async (_: unknown, formData: FormData) => {
    const token = await getReCaptchaToken(reCaptchaSiteKey);
    return await formAction(_, formData, token);
  };

  const { openMfaModal, mfaOnErrorTriggered, mfaOnSuccessTriggered } = useMfaModalDialog();
  const [lastResult, submitAction, isPending] = useActionState(onSubmit, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => {
      const validation = parseWithZod(formData, { schema: matchSchema });
      if (validation.status === "error") {
        sendValidationAnalytics(validation.error);
      }
      return validation;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      identificationMethod: defaultIdentificationMethod,
    },
  });

  useEffect(() => {
    /**
     * TODO - DED-1296 - Should this be moved up to the page and passed into the form to make it easier to test etc?
     */
    const signInWithAdb2c = async () => {
      await signIn("azure-ad-b2c", { callbackUrl: "/identify/register/link-member" });
    };

    // We only get a "success" when a member match is found, so show
    // a loading modal while we are displaying the MFA modal dialog and
    // navigating out to ADB2C on successful completion of MFA verification.
    if (lastResult?.status === "success") {
      const firstName =
        typeof lastResult.initialValue?.firstName === "string" ? lastResult.initialValue.firstName.trim() : "";
      const weFoundYouMessage =
        firstName.length > 0 && firstName.length <= MAX_NAME_LENGTH
          ? `We've found you, ${firstName}!`
          : "We've found you!";
      logCustomEvent("Member matched");
      openMfaModal(signInWithAdb2c, weFoundYouMessage);
    } else if (lastResult?.error?.[""]?.[0] === ("NoMatchError" satisfies PersonMatchError)) {
      logCustomEvent("We couldn't find your details error dialog");
    } else if (lastResult?.error?.[""]?.[0] === ("DuplicateMatchError" satisfies PersonMatchError)) {
      logCustomEvent("There was an issue with your details duplicate error dialog");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResult]);

  function sendValidationAnalytics(validationErrors: Record<string, string[] | null> | null) {
    if (validationErrors === null) {
      return;
    }

    function sendInvalidFieldError(key: string) {
      switch (key) {
        case "firstName":
          logCustomEvent("First name character error validation");
          break;
        case "lastName":
          logCustomEvent("Last name character error validation");
          break;
        case "dateOfBirth":
          logCustomEvent("Date of birth error validation");
          break;
        case "mobileNumber":
          logCustomEvent("Mobile number character error validation");
          break;
        case "membershipNumber":
          logCustomEvent("Membership number character error validation");
          break;
        case "policyNumber":
          logCustomEvent("Insurance policy number character error validation");
          break;
      }
    }

    Object.keys(validationErrors).forEach((key) => {
      if (validationErrors[`${key}`]?.includes(REQUIRED_ERROR_MESSAGE)) {
        logCustomEvent("Nothing entered error validation");
      } else {
        sendInvalidFieldError(key);
      }
    });
  }

  return (
    <form {...getFormProps(form)} action={submitAction}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <RacLogo />
        <Typography variant="h1" align="center" mt={4}>
          To start, let's confirm your details
        </Typography>
        <Container>
          <FormControl error={!fields.firstName.valid} sx={{ marginTop: 0 }} fullWidth>
            <RacwaTextInput
              {...getInputProps(fields.firstName, { type: "text" })}
              key={firstNameInputId}
              id={firstNameInputId}
              label="First name"
              aria-label="First name"
              placeholder="e.g. John"
              formControlMargin="none"
              error={!fields.firstName.valid}
              onBlur={() => logFieldTouched("First name")}
              defaultValue={lastResult?.initialValue?.firstName}
              slotProps={{
                input: {
                  maxLength: MAX_FIRST_NAME_LENGTH,
                  spellCheck: false,
                  autoComplete: "given-name",
                },
              }}
            />
            <FormHelperText id="first-name-error">{fields.firstName.errors}</FormHelperText>
          </FormControl>

          <FormControl error={!fields.lastName.valid} fullWidth>
            <RacwaTextInput
              {...getInputProps(fields.lastName, { type: "text" })}
              key={lastNameInputId}
              id={lastNameInputId}
              label="Last name"
              aria-label="Last name"
              placeholder="e.g. Smith"
              formControlMargin="none"
              error={!fields.lastName.valid}
              onBlur={() => logFieldTouched("Last name")}
              defaultValue={lastResult?.initialValue?.lastName}
              slotProps={{
                input: {
                  maxLength: MAX_LAST_NAME_LENGTH,
                  spellCheck: false,
                  autoComplete: "family-name",
                },
              }}
            />
            <FormHelperText id="last-name-error">{fields.lastName.errors}</FormHelperText>
          </FormControl>

          <FormControl error={!fields.dateOfBirth.valid} fullWidth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <RacwaDateField
                {...getInputProps(fields.dateOfBirth, { type: "date" })}
                key={dateOfBirthInputId}
                id={dateOfBirthInputId}
                label="Date of birth"
                aria-label="Date of birth"
                formControlMargin="none"
                format={DATE_STRING_FORMAT}
                defaultValue={
                  typeof lastResult?.initialValue?.dateOfBirth === "string"
                    ? parse(lastResult.initialValue.dateOfBirth, DATE_STRING_FORMAT, new Date())
                    : undefined
                }
                value={
                  fields.dateOfBirth.valid && fields.dateOfBirth.value?.match(FORMATTED_DATE_STRING_REGEX)
                    ? parse(fields.dateOfBirth.value, DATE_STRING_FORMAT, new Date())
                    : undefined
                }
                error={!fields.dateOfBirth.valid}
                onBlur={() => logFieldTouched("Date of birth")}
                slotProps={{
                  textField: {
                    type: "text",
                    autoComplete: "off",
                    inputProps: {
                      inputMode: "numeric",
                      spellCheck: false,
                    },
                  },
                }}
                fullWidth
                clearable
              />
            </LocalizationProvider>
            <FormHelperText id="date-of-birth-error">{fields.dateOfBirth.errors}</FormHelperText>
          </FormControl>

          <FormControl error={!fields.identificationMethod.valid} sx={{ marginBottom: 0 }} fullWidth>
            <IdentificationMethodRadioGroup defaultValue={defaultIdentificationMethod}>
              <IdentificationMethodRadioItem
                {...getInputProps(fields.identificationMethod, { type: "radio" })}
                key="identification-method-option-mobile"
                label="Mobile number"
                value={IdentificationMethod.Mobile}
                checked={fields.identificationMethod.value === IdentificationMethod.Mobile}
              />
              <IdentificationMethodRadioItem
                {...getInputProps(fields.identificationMethod, { type: "radio" })}
                key="identification-method-option-membership"
                label="Membership number"
                value={IdentificationMethod.Membership}
                checked={fields.identificationMethod.value === IdentificationMethod.Membership}
              />
              <IdentificationMethodRadioItem
                {...getInputProps(fields.identificationMethod, { type: "radio" })}
                key="identification-method-option-policy"
                label="Insurance policy number"
                value={IdentificationMethod.Policy}
                checked={fields.identificationMethod.value === IdentificationMethod.Policy}
              />
            </IdentificationMethodRadioGroup>
            <FormHelperText id="identification-method-error">{fields.identificationMethod.errors}</FormHelperText>
          </FormControl>

          {fields.identificationMethod.value === IdentificationMethod.Mobile && (
            <FormControl error={!fields.mobileNumber.valid} sx={{ marginBottom: 0 }} fullWidth>
              <RacwaTextInput
                {...getInputProps(fields.mobileNumber, { type: "number" })}
                key={mobileNumberInputId}
                id={mobileNumberInputId}
                label="Mobile number"
                aria-label="Mobile number"
                sublabel="The mobile number you provided to RAC."
                placeholder="e.g. 0412345678"
                formControlMargin="none"
                error={!!fields.mobileNumber.errors}
                onBlur={() => logFieldTouched("Mobile number")}
                defaultValue={lastResult?.initialValue?.mobileNumber}
                onChange={(event) => {
                  event.target.value = event.target.value.replace(NON_NUMERIC_REGEX, "");
                }}
                slotProps={{
                  input: {
                    type: "text",
                    inputMode: "numeric",
                    spellCheck: false,
                    autoComplete: "mobile tel-national",
                  },
                }}
              />
              <FormHelperText id="mobile-number-error">{fields.mobileNumber.errors}</FormHelperText>
            </FormControl>
          )}

          {fields.identificationMethod.value === IdentificationMethod.Membership && (
            <FormControl error={!fields.membershipNumber.valid} sx={{ marginBottom: 0 }} fullWidth>
              <RacwaTextInput
                {...getInputProps(fields.membershipNumber, { type: "text" })}
                key={membershipNumberInputId}
                id={membershipNumberInputId}
                label="Membership number"
                aria-label="Membership number"
                sublabel="You can find this on your membership card."
                placeholder="e.g. 01-248815-4"
                formControlMargin="none"
                error={!!fields.membershipNumber.errors}
                onBlur={() => logFieldTouched("Membership number")}
                defaultValue={lastResult?.initialValue?.membershipNumber}
                slotProps={{
                  input: {
                    maxLength: MAX_MEMBERSHIP_NUMBER_LENGTH,
                    spellCheck: false,
                    autoComplete: "off",
                  },
                }}
              />
              <FormHelperText id="membership-number-error">{fields.membershipNumber.errors}</FormHelperText>
            </FormControl>
          )}

          {fields.identificationMethod.value === IdentificationMethod.Policy && (
            <FormControl error={!fields.policyNumber.valid} sx={{ marginBottom: 0 }} fullWidth>
              <RacwaTextInput
                {...getInputProps(fields.policyNumber, { type: "text" })}
                key={policyNumberInputId}
                id={policyNumberInputId}
                label="Insurance policy number"
                aria-label="Insurance policy number"
                sublabel="You can find this on your policy document or on an email from us."
                placeholder="e.g. MGP123456789"
                formControlMargin="none"
                error={!!fields.policyNumber.errors}
                onBlur={() => logFieldTouched("Insurance policy number")}
                defaultValue={lastResult?.initialValue?.policyNumber}
                slotProps={{
                  input: {
                    maxLength: MAX_INSURANCE_POLICY_NUMBER_LENGTH,
                    spellCheck: false,
                    autoComplete: "off",
                  },
                }}
              />
              <FormHelperText id="policy-number-error">{fields.policyNumber.errors}</FormHelperText>
            </FormControl>
          )}

          {lastResult?.error?.[""]?.[0] === ("NoMatchError" satisfies PersonMatchError) && (
            <Box mt={3}>
              <RacwaCardNotification severity="error" title="We couldn't find your details">
                Please check that you've entered your information correctly and it matches the details you provided to
                RAC.
              </RacwaCardNotification>
            </Box>
          )}

          {lastResult?.error?.[""]?.[0] === ("DuplicateMatchError" satisfies PersonMatchError) && (
            <Box mt={3}>
              <RacwaCardNotification severity="error" title="There was an issue with your details">
                Please try again using another verification method (e.g. policy number or membership number).
                <br />
                <br />
                If you're still having issues, please call us on{" "}
                <RegistrationPhoneLink
                  analyticsEvent={`There was an issue with your details duplicate - ${RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT}`}
                />
                .
              </RacwaCardNotification>
            </Box>
          )}

          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            disabled={isPending || mfaOnErrorTriggered === true || mfaOnSuccessTriggered === true}
            sx={{ marginY: 3 }}
          >
            Next
          </Button>

          <CancelLink onClick={() => logCustomEvent("Cancel")} />

          <ReCaptcha reCaptchaSiteKey={reCaptchaSiteKey} />
        </Container>
        {/* Separate loading modals for form submitting, navigating out to ADB2C on MFA Success and navigating to error page on MFA error */}
        <RacwaLoadingModal message="Submitting" open={isPending} />
        <RacwaLoadingModal message="We've verified you!" open={mfaOnSuccessTriggered === true} />
        <RacwaLoadingModal message="Something went wrong" open={mfaOnErrorTriggered === true} />
      </div>
    </form>
  );
}
