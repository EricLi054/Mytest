import type { LinkProps } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Description, Stories, Subtitle, Title } from "@storybook/blocks";

import type { RacwaStepperTemplateProps } from "@racwa/react-components";
import { RacwaCardNotification, RacwaStepperTemplate } from "@racwa/react-components";

import type { OneTimePasswordProps, OtpVerificationDetails } from "./types";
import OneTimePasswordDialog from ".";
import { getMockVerificationDetails } from "./testing/mocks";

const expectedOtpCode = "000000";

/** Use `await wait(100)` not `setTimeout` */
const wait = (timeout: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, timeout);
  });
};

/** RacwaStepperTemplate footer links default to the production environment. */
const getFooterLinkProps = (path: string): Partial<LinkProps> => ({
  href: `https://cdvnets.ractest.com.au/about-rac/site-info/${path}`,
});

const meta = {
  title: "mfa/Composites/One Time Password",
  component: Template,
  tags: ["@racwa/mfa"],
  parameters: {
    layout: "fullscreen",
    docs: {
      toc: {
        title: "Stories",
      },
      page: () => (
        <>
          <Title />
          <Subtitle>
            Dialog to display when a member needs to complete One Time Password (OTP) verification to satisfy Multi
            Factor Authentication (MFA) security requirements before accessing sensitive data or performing sensitive
            actions like registering for a myRAC account, updating their myRAC account details or performing an update
            to their personal/banking details stored with RAC.
          </Subtitle>
          <Description />
          <Stories />
        </>
      ),
      description: {
        component:
          "Notes:\n" +
          "- The RacwaLoadingModal backdrop that displays when sending/verifying does not correctly display over the dialog when interacting with the stories on the docs page",
      },
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/R1M2k2KikHQWrLiS0RAisj/myRAC-Registration-with-MFA?node-id=531-10826",
    },
  },
  args: {
    otpVerificationDetails: getMockVerificationDetails(),
  },
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof meta>;

type StoryProps = Omit<
  OneTimePasswordProps,
  | "getVerificationDetails"
  | "checkAndSendOtp"
  | "checkAndVerifyOtp"
  | "faqUrl"
  | "onClickClose"
  | "onError"
  | "onSuccess"
  | "showDialog"
> & {
  description: string;
  otpVerificationDetails: OtpVerificationDetails;
  maxSendAttempts?: number;
  maxVerificationAttempts?: number;
  verificationExpired?: boolean;
};

const templateProps: Omit<RacwaStepperTemplateProps, "children"> = {
  sidebarTitle: "One Time Password Dialog",
  breadcrumbs: {
    links: [{ name: "Composites", href: "/?path=/docs/mfa-composites-one-time-password--docs", key: "1" }],
    currentPage: { name: "One Time Password Dialog", key: "2" },
  },
  showHeader: true,
  headerEndAction: <></>,
  mobileStepperProps: { hideBack: true, hideProgress: true },
  showNotificationBanner: true,
  notificationBannerContent: (
    <Box sx={{ textAlign: "center", backgroundColor: "#005b96" }}>
      <Typography variant="h2" sx={{ color: "common.white" }}>
        Expected OTP Verification Code: {expectedOtpCode}
      </Typography>
    </Box>
  ),
  footerProps: {
    variant: "sidebar",
    accessibilityLinkProps: getFooterLinkProps("accessibility"),
    disclaimerLinkProps: getFooterLinkProps("disclaimer"),
    privacyLinkProps: getFooterLinkProps("privacy"),
    securityLinkProps: getFooterLinkProps("security"),
  },
};

/**
 * TODO - DED-1295 - Can useOneTimePassword hook be mocked in Storybook?
 * https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules
 */
function Template({
  description,
  verificationExpired,
  maxSendAttempts = 5,
  maxVerificationAttempts = 5,
  ...props
}: StoryProps) {
  const [showMfa, setShowMfa] = useState<boolean>(false);
  const [sendAttempts, setSendAttempts] = useState<number>(0);
  const [verificationAttempts, setVerificationAttempts] = useState<number>(0);
  const [result, setResult] = useState<"pending" | "success" | "error">("pending");

  return (
    <div style={{ height: "100dvh" }}>
      <RacwaStepperTemplate {...templateProps} contentTitle={description}>
        {showMfa && (
          <OneTimePasswordDialog
            getVerificationDetails={async () => {
              await wait(1000);
              return Promise.resolve(props.otpVerificationDetails);
            }}
            helpDisplayPhoneNumber={props.helpDisplayPhoneNumber}
            checkAndSendOtp={async () => {
              setSendAttempts(sendAttempts + 1);
              await wait(1000);
              if (sendAttempts >= maxSendAttempts) {
                setResult("error");
                return Promise.resolve({ errorCode: "TooManyRequestsError" });
              } else {
                return Promise.resolve({ data: { hasSendAttemptsRemaining: sendAttempts < maxSendAttempts } });
              }
            }}
            checkAndVerifyOtp={async (verificationCode) => {
              setVerificationAttempts(verificationAttempts + 1);
              await wait(1000);
              if (verificationAttempts >= maxVerificationAttempts) {
                setResult("error");
                return Promise.resolve({ errorCode: "TooManyRequestsError" });
              } else if (verificationExpired) {
                setResult("error");
                return Promise.resolve({ errorCode: "NotFoundError" });
              } else {
                return Promise.resolve({ data: { isVerified: verificationCode === expectedOtpCode } });
              }
            }}
            onClickClose={() => setShowMfa(false)}
            showDialog={showMfa}
            onError={async () => Promise.resolve(setResult("error"))}
            onSuccess={async () => Promise.resolve(setResult("success"))}
            faqUrl="about:blank"
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RacwaCardNotification
            severity={result === "pending" ? "warning" : result === "success" ? "success" : "error"}
            title={result === "pending" ? "Pending" : result === "success" ? "Success" : "Error"}
          />
          {result === "pending" && (
            <Button variant="contained" color="primary" fullWidth onClick={() => setShowMfa(true)} disabled={showMfa}>
              Show MFA
            </Button>
          )}
        </div>
      </RacwaStepperTemplate>
    </div>
  );
}

export const WithMobile = { args: { description: "With Mobile" } } satisfies Story;

export const WithLandline = {
  args: {
    description: "With Landline",
    otpVerificationDetails: {
      ...meta.args.otpVerificationDetails,
      isMobile: false,
    },
  },
} satisfies Story;

export const WithAuthenticationAlreadyCompleted = {
  args: {
    description: "With Authentication Already Completed",
    otpVerificationDetails: {
      ...meta.args.otpVerificationDetails,
      isAuthenticated: true,
    },
  },
} satisfies Story;

export const WithNoPhoneNumberSuffix = {
  args: {
    description: "With No Phone Number Suffix",
    otpVerificationDetails: {
      ...meta.args.otpVerificationDetails,
      phoneNumberSuffix: "",
    },
  },
} satisfies Story;

export const WithOneSendAttemptRemaining = {
  args: {
    description: "With One Send Attempt Remaining",
    maxSendAttempts: 1,
  },
} satisfies Story;

export const WithNoSendAttemptsRemaining = {
  args: {
    description: "With No Send Attempts Remaining",
    maxSendAttempts: 0,
  },
} satisfies Story;

/**
 * TODO - DED-1295 - Currently unable to mock GQL NotFound error type.
 * - Should display the following error message returned from useOneTimePassword hook:
 *  - "Sorry, that code has expired. Please request a new code."
 */
export const WithVerificationAttemptExpired = {
  args: {
    description: "With Verification Attempt Expired",
    verificationExpired: true,
  },
} satisfies Story;

export const WithOneSendAttemptRemainingAndVerificationAttemptExpired = {
  args: {
    description: "With One Send Attempt Remaining and Verification Attempt Expired",
    maxSendAttempts: 1,
    verificationExpired: true,
  },
} satisfies Story;

export const WithCustomHelpPhoneNumber = {
  args: {
    description: "With Custom Help Phone Number",
    helpDisplayPhoneNumber: "1300 045 617",
  },
} satisfies Story;
