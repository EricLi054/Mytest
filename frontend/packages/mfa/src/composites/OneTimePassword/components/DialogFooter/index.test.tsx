import type {
  ContactMethodValue,
  FlowValues,
  NotAuthenticatedStateFlowValue,
  VerifyOptionsValue,
} from "#composites/OneTimePassword/types/internal";
import { Button } from "@mui/material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEFAULT_RAC_PHONE_NUMBER } from "#composites/OneTimePassword/constants";
import { ContactMethod, NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";
import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it } from "vitest";

import type { DialogFooterProps } from ".";
import { DialogFooter } from ".";

const expectedFaqUrl = "about:blank";
const expectedDisplayPhoneNumber = "13 00 00";

type TestProps = Omit<DialogFooterProps, "dialogId" | "faqUrl" | "memberStatus" | "selectionStatus"> & {
  memberStatus?: VerifyOptionsValue;
  selectionStatus?: NotAuthenticatedStateFlowValue;
};

const TestComponent = ({
  helpDisplayPhoneNumber,
  memberStatus = VerifyOptions.None,
  selectionStatus = NotAuthenticatedStateFlow.VerificationOptionNotSelected,
  header,
}: TestProps) => {
  return (
    <DialogFooter
      dialogId="test-dialog"
      memberStatus={memberStatus}
      selectionStatus={selectionStatus}
      faqUrl={expectedFaqUrl}
      helpDisplayPhoneNumber={helpDisplayPhoneNumber}
      header={header}
    />
  );
};

const getHelpLink = () => screen.getByRole("link", { name: "Visit our FAQs" });
const getNotYourNumberLink = (number = expectedDisplayPhoneNumber) => screen.getByRole("link", { name: number });

describe("DialogFooter", () => {
  it("should render", () => {
    render(<TestComponent helpDisplayPhoneNumber={expectedDisplayPhoneNumber} />);

    const helpLink = getHelpLink();
    const notYourNumberLink = getNotYourNumberLink();

    expect(screen.getByText("Need help?")).toBeVisible();
    expect(helpLink).toBeVisible();
    expect(helpLink).toHaveProperty("href", expectedFaqUrl);
    expect(screen.getByText("Not your number? Call")).toBeVisible();
    expect(notYourNumberLink).toBeVisible();
    expect(notYourNumberLink).toHaveProperty("href", `tel:130000`);
  });

  it.each(["", " "])(
    "should render with DEFAULT_RAC_PHONE_NUMBER when helpDisplayPhoneNumber is [%s]",
    (helpDisplayPhoneNumber) => {
      render(<TestComponent helpDisplayPhoneNumber={helpDisplayPhoneNumber} />);

      const notYourNumberLink = getNotYourNumberLink(DEFAULT_RAC_PHONE_NUMBER);

      expect(screen.getByText("Not your number? Call")).toBeVisible();
      expect(notYourNumberLink).toBeVisible();
      expect(notYourNumberLink).toHaveProperty("href", `tel:131703`);
    },
  );

  it("should render header element when defined", () => {
    const expectedHeaderText = "Header button";
    const expectedHeaderElement = <Button>{expectedHeaderText}</Button>;

    render(<TestComponent header={expectedHeaderElement} helpDisplayPhoneNumber={expectedDisplayPhoneNumber} />);

    expect(screen.getByRole("button", { name: expectedHeaderText })).toBeVisible();
  });

  describe("Analytics", () => {
    type TestCase = Pick<FlowValues, "selectionStatus" | "memberStatus"> & {
      contactMethod: ContactMethodValue;
      dialog: "Lets verify its you" | "Enter verification code";
    };

    const smsTestCases = [
      {
        memberStatus: VerifyOptions.HasMobile,
        selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
        contactMethod: ContactMethod.Sms,
        dialog: "Lets verify its you",
      },
      {
        memberStatus: VerifyOptions.HasMobile,
        selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
        contactMethod: ContactMethod.Sms,
        dialog: "Enter verification code",
      },
    ] as const satisfies TestCase[];

    const mobileCallTestCases = [
      {
        memberStatus: VerifyOptions.HasMobile,
        selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
        contactMethod: ContactMethod.MobileCall,
        dialog: "Lets verify its you",
      },
      {
        memberStatus: VerifyOptions.HasMobile,
        selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
        contactMethod: ContactMethod.MobileCall,
        dialog: "Enter verification code",
      },
    ] as const satisfies TestCase[];

    const landlineCallTestCases = [
      {
        memberStatus: VerifyOptions.HasLandline,
        selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
        contactMethod: ContactMethod.LandlineCall,
        dialog: "Lets verify its you",
      },
      {
        memberStatus: VerifyOptions.HasLandline,
        selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
        contactMethod: ContactMethod.LandlineCall,
        dialog: "Enter verification code",
      },
    ] as const satisfies TestCase[];

    const testCases = [...smsTestCases, ...mobileCallTestCases, ...landlineCallTestCases] as const satisfies TestCase[];

    it.each(testCases)(
      "should fire 'MFA - $contactMethod - $dialog - Call 13 17 03' event when phone link is clicked",
      async ({ contactMethod, dialog, memberStatus, selectionStatus }) => {
        const user = userEvent.setup();
        const expectedEventDescription = `MFA - ${contactMethod} - ${dialog} - Call ${expectedDisplayPhoneNumber}`;
        render(
          <TestComponent
            helpDisplayPhoneNumber={expectedDisplayPhoneNumber}
            memberStatus={memberStatus}
            selectionStatus={selectionStatus}
          />,
        );

        await user.click(getNotYourNumberLink());

        expectGtmCustomEvent(expectedEventDescription);
      },
    );

    it.each(testCases)(
      "should fire 'MFA - $contactMethod - $dialog - Visit our FAQs' event when FAQ link is clicked",
      async ({ contactMethod, dialog, memberStatus, selectionStatus }) => {
        const user = userEvent.setup();
        const expectedEventDescription = `MFA - ${contactMethod} - ${dialog} - Visit our FAQs`;
        render(
          <TestComponent
            helpDisplayPhoneNumber={expectedDisplayPhoneNumber}
            memberStatus={memberStatus}
            selectionStatus={selectionStatus}
          />,
        );

        await user.click(getHelpLink());

        expectGtmCustomEvent(expectedEventDescription);
      },
    );
  });
});
