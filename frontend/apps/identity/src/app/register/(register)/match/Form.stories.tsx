import type { SubmissionResult } from "@conform-to/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Box, Typography } from "@mui/material";

import type { OtpVerificationDetails, SendOtpResponse, VerifyOtpResponse } from "@racwa/mfa";

import type { Person } from "./types";
import MatchForm from "./Form";
import { MfaModalDialogProvider } from "./providers/mfa";

const meta = {
  title: "Identity/Forms/Match",
  component: Template,
  tags: ["@racwa/identity"],
} satisfies Meta<typeof Template>;

export default meta;

type Story = StoryObj<typeof Template>;

const mockMatchedPerson: Person = {
  personId: "00000000-0000-0000-0000-00000000000",
  racId: "00000001",
  firstName: "John",
  mobilePhone: "0400000000",
  membershipType: "Member",
};
const mockOtpVerificationDetails: OtpVerificationDetails = {
  sessionKey: "my-rac-account-registration-123456789-987654321",
  isAuthenticated: false,
  isMobile: true,
  phoneNumberSuffix: "000",
};
const mockSendOtpResponse: SendOtpResponse = {
  data: { hasSendAttemptsRemaining: true },
};
const mockVerifyOtpResponse: VerifyOtpResponse = {
  data: { isVerified: true },
};

type StoryProps = {
  description: string;
  matchedPerson: Person;
  submissionResultStatus: "success" | "error";
  getVerificationDetailsResponse: OtpVerificationDetails;
  sendOtpResponse: SendOtpResponse;
  verifyOtpResponse: VerifyOtpResponse;
};

function Template({
  description,
  submissionResultStatus = "success",
  getVerificationDetailsResponse = mockOtpVerificationDetails,
  sendOtpResponse = mockSendOtpResponse,
  verifyOtpResponse = mockVerifyOtpResponse,
}: StoryProps) {
  return (
    <>
      <Box marginBottom="40px" sx={{ textAlign: "center", backgroundColor: "#005b96" }}>
        <Typography variant="h2" sx={{ color: "common.white" }}>
          {description}
        </Typography>
      </Box>
      <MfaModalDialogProvider
        getVerificationDetailsAction={() => Promise.resolve(getVerificationDetailsResponse)}
        sendOtpAction={() => Promise.resolve(sendOtpResponse)}
        verifyOtpAction={() => Promise.resolve(verifyOtpResponse)}
      >
        <MatchForm
          reCaptchaSiteKey="reCaptchaSiteKey"
          formAction={() => Promise.resolve({ status: submissionResultStatus } satisfies SubmissionResult<string[]>)}
        />
      </MfaModalDialogProvider>
    </>
  );
}

export const MatchSuccessMobileVerificationDetails: Story = {
  name: "Match Form Success - Mobile OTP VerificationDetails",
  args: {
    description:
      "Form submission will be successful if match inputs are valid and MFA 'Send a code' dialog will be successful",
  },
};

export const MatchSuccessLandlineVerificationDetails: Story = {
  name: "Match Form Success - Landline OTP VerificationDetails",
  args: {
    description:
      "Form submission will be successful if match inputs are valid and MFA 'Request a call' dialog will be successful",
    getVerificationDetailsResponse: { ...mockOtpVerificationDetails, isMobile: false },
  },
};

export const MatchSuccessMemberAlreadyAuthenticated: Story = {
  name: "Match Form Success - Member already authenticated",
  args: {
    description:
      "Form submission will be successful if match inputs are valid, but MFA will close on load as the member is already authenticated",
    submissionResultStatus: "success",
    getVerificationDetailsResponse: { ...mockOtpVerificationDetails, isAuthenticated: true },
  },
};

export const MatchErrorLapsedMembership: Story = {
  name: "Match Form Error - Lapsed membership",
  args: {
    description: "Form submission will return an error due to lapsed membership type, so MFA dialog will never display",
    submissionResultStatus: "error",
    matchedPerson: { ...mockMatchedPerson, membershipType: null },
  },
};

export const MatchErrorNoSendAttemptsRemaining: Story = {
  name: "Match Form Error - Member has no send attempts remaining",
  args: {
    description:
      "Form submission will be successful if match inputs are valid, but MFA will error due to no send attempts remaining",
    submissionResultStatus: "error",
    sendOtpResponse: { data: { hasSendAttemptsRemaining: false } },
  },
};

export const MatchErrorNotVerified: Story = {
  name: "Match Form Error - Member is not verified",
  args: {
    description:
      "Form submission will be successful if match inputs are valid, but MFA will error due to no the verification failing",
    submissionResultStatus: "error",
    verifyOtpResponse: { data: { isVerified: false } },
  },
};
