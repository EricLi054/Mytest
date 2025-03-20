import type { FlowValues } from "#composites/OneTimePassword/types/internal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OtpFlowStateProvider } from "#composites/OneTimePassword/contexts/OtpFlowState/index";
import { getMockDefaultFlowState } from "#composites/OneTimePassword/testing/mocks";
import { NotAuthenticatedStateFlow, VerifyOptions } from "#composites/OneTimePassword/types/internal";
import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import type { FooterHeaderProps } from ".";
import FooterHeader from ".";

const parentId = "parent";
const mockDefaultFlowState = getMockDefaultFlowState();

const mockClearOtpInput = vi.fn();

const mockUseFlowState = vi.fn();
const mockSetFlowState = vi.fn();
vi.mock("../../../../contexts/OtpFlowState", async () => {
  const actual = await vi.importActual("../../../../contexts/OtpFlowState");
  return {
    ...actual,
    useOtpFlowState: (): { flowState: FlowValues; setFlowState: typeof mockSetFlowState } =>
      mockUseFlowState() as { flowState: FlowValues; setFlowState: typeof mockSetFlowState },
  };
});

type TestProps = Partial<FooterHeaderProps> & {
  flowState?: Partial<FlowValues>;
};

const TestComponent = ({ flowState, ...props }: TestProps) => {
  const mockFlowState: FlowValues = {
    ...mockDefaultFlowState,
    memberStatus: flowState?.memberStatus ?? mockDefaultFlowState.memberStatus,
    selectionStatus: flowState?.selectionStatus ?? mockDefaultFlowState.selectionStatus,
  };

  mockUseFlowState.mockReturnValue({ flowState: mockFlowState, setFlowState: mockSetFlowState });

  return (
    <div data-testid={parentId}>
      <OtpFlowStateProvider>
        <FooterHeader {...props} clearOtpInput={mockClearOtpInput} />
      </OtpFlowStateProvider>
    </div>
  );
};

const sendNewCodeLinkText = "Send new code";
const getCodeViaAPhoneCallLinkText = "Get code via phone call";
const getAnotherPhoneCallLinkText = "Get another phone call";
const sendCodeViaSmsLinkText = "Send code via SMS";

const getSendNewCodeLink = () => screen.getByRole("link", { name: sendNewCodeLinkText });
const getCodeViaAPhoneCallLink = () => screen.getByRole("link", { name: getCodeViaAPhoneCallLinkText });
const getAnotherPhoneCallLink = () => screen.getByRole("link", { name: getAnotherPhoneCallLinkText });
const getSendCodeViaSmsLink = () => screen.getByRole("link", { name: sendCodeViaSmsLinkText });

describe("FooterHeader", () => {
  it.each([
    NotAuthenticatedStateFlow.PhoneCallVerificationOption,
    NotAuthenticatedStateFlow.SMSVerificationOption,
    NotAuthenticatedStateFlow.VerificationOptionNotSelected,
  ])("should not render when selectionStatus is %s", (selectionStatus) => {
    render(<TestComponent flowState={{ selectionStatus }} />);

    expect(screen.getByTestId(parentId)).toBeEmptyDOMElement();
  });

  it.each([VerifyOptions.HasMobile, VerifyOptions.HasLandline])(
    "should render when selectionStatus is ReadyToVerifyWithSMS and memberStatus is %s",
    (memberStatus) => {
      render(
        <TestComponent flowState={{ memberStatus, selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />,
      );

      expect(getSendNewCodeLink()).toBeVisible();
      expect(getCodeViaAPhoneCallLink()).toBeVisible();
    },
  );

  it.each([VerifyOptions.HasMobile, VerifyOptions.HasLandline, VerifyOptions.None])(
    "should render when flowState selectionStatus is ReadyToVerifyWithPhoneCall and memberStatus is %s",
    (memberStatus) => {
      render(
        <TestComponent
          flowState={{ memberStatus, selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }}
        />,
      );

      expect(getAnotherPhoneCallLink()).toBeVisible();

      if (memberStatus === VerifyOptions.HasMobile) {
        expect(getSendCodeViaSmsLink()).toBeVisible();
      } else {
        expect(screen.queryByRole("link", { name: sendCodeViaSmsLinkText })).toBeNull();
      }
    },
  );

  describe("Analytics", () => {
    it("should trigger gtm event when SendNewCodeLink is clicked", async () => {
      const expectedEventDescription = "MFA - Sms - Enter verification code - Send new code";
      const user = userEvent.setup();
      render(<TestComponent flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

      await user.click(getSendNewCodeLink());

      expectGtmCustomEvent(expectedEventDescription);
    });

    it("should trigger gtm event when GetCodeViaAPhoneCallLink is clicked", async () => {
      const expectedEventDescription = "MFA - Sms - Enter verification code - Get code via phone call";
      const user = userEvent.setup();
      render(<TestComponent flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

      await user.click(getCodeViaAPhoneCallLink());

      expectGtmCustomEvent(expectedEventDescription);
    });

    it("should trigger gtm event when GetAnotherPhoneCallLink is clicked", async () => {
      const expectedEventDescription = "MFA - Landline call - Enter verification code - Get another phone call";
      const user = userEvent.setup();
      render(
        <TestComponent
          flowState={{
            memberStatus: VerifyOptions.HasLandline,
            selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
          }}
        />,
      );

      await user.click(getAnotherPhoneCallLink());

      expectGtmCustomEvent(expectedEventDescription);
    });

    it("should trigger gtm event when GetSendCodeViaSmsLink is clicked", async () => {
      const expectedEventDescription = "MFA - Mobile call - Enter verification code - Send code via SMS";
      const user = userEvent.setup();
      render(<TestComponent flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }} />);

      await user.click(getSendCodeViaSmsLink());

      expectGtmCustomEvent(expectedEventDescription);
    });
  });

  describe("SetFlowState", () => {
    it("should call setFlowState when SendNewCodeLink is clicked", async () => {
      const user = userEvent.setup();
      render(
        <TestComponent
          flowState={{
            memberStatus: VerifyOptions.HasMobile,
            selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
          }}
        />,
      );
      await user.click(getSendNewCodeLink());

      expect(mockSetFlowState).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockDefaultFlowState,
          memberStatus: VerifyOptions.HasMobile,
          selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
        }),
      );
    });

    it("should call setFlowState when GetCodeViaAPhoneCallLink is clicked", async () => {
      const user = userEvent.setup();
      render(
        <TestComponent
          flowState={{
            memberStatus: VerifyOptions.HasMobile,
            selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
          }}
        />,
      );

      await user.click(getCodeViaAPhoneCallLink());

      expect(mockSetFlowState).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockDefaultFlowState,
          selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
        }),
      );
    });

    it("should call setFlowState when GetAnotherPhoneCallLink is clicked", async () => {
      const user = userEvent.setup();
      render(
        <TestComponent
          flowState={{
            memberStatus: VerifyOptions.HasMobile,
            selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
          }}
        />,
      );

      await user.click(getAnotherPhoneCallLink());

      expect(mockSetFlowState).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockDefaultFlowState,
          memberStatus: VerifyOptions.HasMobile,
          selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
        }),
      );
    });

    it("should call setFlowState when GetSendCodeViaSmsLink is clicked", async () => {
      const user = userEvent.setup();
      render(
        <TestComponent
          flowState={{
            memberStatus: VerifyOptions.HasMobile,
            selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
          }}
        />,
      );

      await user.click(getSendCodeViaSmsLink());

      expect(mockSetFlowState).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockDefaultFlowState,
          memberStatus: VerifyOptions.HasMobile,
          selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
        }),
      );
    });
  });

  describe("ClearOtpInput", () => {
    it("should call clearOtpInput when SendNewCodeLink is clicked", async () => {
      const user = userEvent.setup();
      render(<TestComponent flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

      await user.click(getSendNewCodeLink());

      expect(mockClearOtpInput).toHaveBeenCalled();
    });

    it("should call clearOtpInput when GetCodeViaAPhoneCallLink is clicked", async () => {
      const user = userEvent.setup();
      render(<TestComponent flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS }} />);

      await user.click(getCodeViaAPhoneCallLink());

      expect(mockClearOtpInput).toHaveBeenCalled();
    });

    it("should call clearOtpInput when GetAnotherPhoneCallLink is clicked", async () => {
      const user = userEvent.setup();
      render(<TestComponent flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }} />);

      await user.click(getAnotherPhoneCallLink());

      expect(mockClearOtpInput).toHaveBeenCalled();
    });

    it("should call clearOtpInput when GetSendCodeViaSmsLink is clicked", async () => {
      const user = userEvent.setup();
      render(<TestComponent flowState={{ selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall }} />);

      await user.click(getSendCodeViaSmsLink());

      expect(mockClearOtpInput).toHaveBeenCalled();
    });
  });
});
