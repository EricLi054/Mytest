import type { SubmissionResult } from "@conform-to/react";
import type { CSSProperties, ReactNode } from "react";
import { useActionState } from "react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Box, Button, Checkbox, FormControl, FormHelperText, FormLabel, Link, Typography } from "@mui/material";
import CancelLink from "#components/CancelLink";
import Container from "#components/Container";
import RacLogo from "#components/RacLogo";
import { logCustomEvent, logFieldTouched } from "#utils/analyticsTagging";

import { RacwaLoadingModal } from "@racwa/react-components";
import { colors } from "@racwa/styles";

import type { CreateSessionAction } from "./actions";
import { beforeYouStartSchema } from "./schema";

export type RegisterFormProps = {
  formAction: CreateSessionAction;
};

export default function RegisterForm({ formAction }: RegisterFormProps) {
  const inputId = "accept-terms-and-conditions-input";
  const inputLabelId = `${inputId}-label`;
  const inputErrorId = `${inputId}-error`;
  const [lastResult, submitAction, isPending] = useActionState(formAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate: ({ formData }) => {
      const validation = parseWithZod(formData, { schema: beforeYouStartSchema });
      if ((validation as SubmissionResult).error?.hasAcceptedTerms) {
        logCustomEvent("Please accept the terms and conditions error validation");
      }
      return validation;
    },
  });

  return (
    <form {...getFormProps(form)} action={submitAction}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <RacLogo />
        <Typography variant="h1" mt={4} style={{ textAlign: "center" }}>
          Set up your digital identity
        </Typography>

        <Container>
          <Typography variant="body1">To register for myRAC, follow these three easy steps:</Typography>

          <DotPoint
            digit={1}
            body={
              <>
                <b>Confirm your personal details</b>
                <br />
                You'll only need to do this once, and it takes less than a minute. You may need your membership or
                policy number on hand.
              </>
            }
            style={{ marginTop: "32px" }}
          />

          <DotPoint
            digit={2}
            body={
              <>
                <b>Verify your mobile number and email address</b>
                <br />
                For added security, we'll send codes to both your mobile and email.
              </>
            }
            style={{ marginTop: "24px" }}
          />

          <DotPoint
            digit={3}
            body={
              <>
                <b>Choose a secure password, and you're all set!</b>
              </>
            }
            style={{ marginTop: "24px" }}
          />

          <FormControl sx={{ marginTop: "32px", marginBottom: "0px" }} error={!fields.hasAcceptedTerms.valid} fullWidth>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                {...getInputProps(fields.hasAcceptedTerms, { type: "checkbox" })}
                key={inputId}
                id={inputId}
                aria-labelledby={inputLabelId}
                style={{ marginRight: "8px" }}
                onChange={() => logFieldTouched("Terms and Conditions")}
              />
              <FormLabel id={inputLabelId} htmlFor={inputId} sx={{ flexGrow: 1, marginBottom: 0 }}>
                <Typography style={{ fontSize: "14px", fontWeight: "400" }}>
                  I accept the{" "}
                  <Link
                    href={process.env.NEXT_PUBLIC_RAC_ABOUT_TERMS_URL}
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{
                      color: fields.hasAcceptedTerms.valid ? colors.linkBlue : colors.brandDangerNew,
                      cursor: "pointer",
                    }}
                    onClick={() => logCustomEvent("Terms and Conditions")}
                  >
                    Terms and Conditions
                  </Link>
                </Typography>
              </FormLabel>
            </div>

            <FormHelperText id={inputErrorId} style={{ fontSize: "12px", marginTop: "8px" }}>
              {fields.hasAcceptedTerms.errors}
            </FormHelperText>
          </FormControl>

          <Box mt={5} mb={3} sx={{ width: "100%" }}>
            <Button type="submit" color="primary" variant="contained" fullWidth>
              Get started
            </Button>
          </Box>

          <CancelLink onClick={() => logCustomEvent("Cancel")} />
        </Container>
        <RacwaLoadingModal open={isPending} />
      </div>
    </form>
  );
}

function DotPoint({
  digit,
  body,
  style: customStyles = {},
}: {
  digit: number;
  body: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{ ...customStyles, display: "flex" }}>
      <div style={{ marginRight: "24px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: colors.dieselDeepest,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <Typography variant="body1" fontWeight={500} fontSize="16px">
            {digit}
          </Typography>
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <Typography variant="body1">{body}</Typography>
      </div>
    </div>
  );
}
