import type { OtpVerificationDetails } from "#composites/OneTimePassword/types";
import type { FlowValues } from "#composites/OneTimePassword/types/internal";
import { renderHook, waitFor } from "@testing-library/react";
import { OTP_VERIFY_CLOSURE_DELAY } from "#composites/OneTimePassword/constants";
import { getMockDefaultFlowState, getMockVerificationDetails } from "#composites/OneTimePassword/testing/mocks";
import {
  NotAuthenticatedStateFlow,
  OneTimePasswordErrorState,
  VerifyOptions,
} from "#composites/OneTimePassword/types/internal";
import { expectGtmCustomEventWithDescriptionContaining } from "#testing/analytics";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useOneTimePassword from ".";

const unhandledErrorEventDescription = "Server error";

const mockDefaultFlowState = getMockDefaultFlowState();
const expectedHandleErrorSetFlowState: FlowValues = {
  isAuthenticated: false,
  hasSendAttemptsRemaining: false,
  memberStatus: VerifyOptions.None,
  selectionStatus: NotAuthenticatedStateFlow.VerificationOptionNotSelected,
};

const mockGetVerificationDetails = vi.fn();
const mockCheckAndSendOtp = vi.fn();
const mockCheckAndVerifyOtp = vi.fn();
const mockOnSuccess = vi.fn();
const mockOnError = vi.fn();

const mockUseFlowState = vi.fn();
const mockSetFlowState = vi.fn();
vi.mock("../../contexts/OtpFlowState", async () => {
  const actual = await vi.importActual("../../contexts/OtpFlowState");
  return {
    ...actual,
    useOtpFlowState: (): { flowState: FlowValues; setFlowState: typeof mockSetFlowState } =>
      mockUseFlowState() as { flowState: FlowValues; setFlowState: typeof mockSetFlowState },
  };
});

type TestProps = { verificationDetails?: OtpVerificationDetails | Error; flowState?: FlowValues };

const initialise = ({ verificationDetails, flowState }: TestProps = {}) => {
  if (verificationDetails instanceof Error) {
    mockGetVerificationDetails.mockRejectedValue(verificationDetails);
  } else {
    mockGetVerificationDetails.mockReturnValue(verificationDetails);
  }
  mockUseFlowState.mockReturnValue({ flowState: flowState ?? mockDefaultFlowState, setFlowState: mockSetFlowState });

  return renderHook(() =>
    useOneTimePassword({
      getVerificationDetails: mockGetVerificationDetails,
      checkAndSendOtp: mockCheckAndSendOtp,
      checkAndVerifyOtp: mockCheckAndVerifyOtp,
      onError: mockOnError,
      onSuccess: mockOnSuccess,
    }),
  );
};

describe("useOneTimePassword", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initialisation", () => {
    it("should initialise", () => {
      const {
        result: { current },
      } = initialise({ verificationDetails: getMockVerificationDetails() });

      expect(current.fields).toBeDefined();
      expect(current.form).toBeDefined();
      expect(current.backdropState).toBeDefined();
      expect(current.phoneSuffix).toBeDefined();
      expect(current.isSubmitting).toBeDefined();
      expect(current.justVerified).toBeDefined();
      expect(current.oneTimePasswordError).toBeDefined();
      expect(current.onReceiveOtpViaSms).toBeDefined();
      expect(current.onReceiveOtpViaCall).toBeDefined();
      expect(current.onSubmitVerifyOtp).toBeDefined();
    });

    it("should trigger onSuccess callback when verification details are defined and member is authenticated", async () => {
      const { result } = initialise({ verificationDetails: getMockVerificationDetails(true) });

      expect(result.current).toBeDefined();

      await waitFor(() => expect(mockOnSuccess).toHaveBeenCalled());

      expect(mockGetVerificationDetails).toHaveBeenCalledTimes(1);
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it.each([true, false])(
      "should initialise when verification details are defined and member is not authenticated and isMobile is %s",
      async (isMobile) => {
        const { result } = initialise({ verificationDetails: { ...getMockVerificationDetails(), isMobile } });

        expect(result.current).toBeDefined();

        await waitFor(() =>
          expect(mockSetFlowState).toHaveBeenCalledWith({
            isAuthenticated: false,
            hasSendAttemptsRemaining: true,
            memberStatus: isMobile ? VerifyOptions.HasMobile : VerifyOptions.HasLandline,
            selectionStatus: isMobile
              ? NotAuthenticatedStateFlow.SMSVerificationOption
              : NotAuthenticatedStateFlow.PhoneCallVerificationOption,
          }),
        );

        expect(mockGetVerificationDetails).toHaveBeenCalledTimes(1);
        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
      },
    );

    describe("ErrorHandling", () => {
      it("should trigger gtm event and onError callback when verification details are defined and member is not authenticated and phoneNumberSuffix is undefined", async () => {
        const { result } = initialise({
          verificationDetails: { ...getMockVerificationDetails(), phoneNumberSuffix: undefined },
        });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining("MC contact information missing");

        expect(mockGetVerificationDetails).toHaveBeenCalledTimes(1);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should error flow state, trigger gtm event and trigger onError callback when getVerificationDetails throws an error", async () => {
        const { result } = initialise({ verificationDetails: new Error() });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining(unhandledErrorEventDescription);

        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockGetVerificationDetails).toHaveBeenCalledTimes(1);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });
  });

  describe("OnReceiveOtpViaSms", () => {
    it("should call setFlowState when onReceiveOtpViaSms is called and checkAndSendOtp returns CheckAndSendOtpResponse", async () => {
      mockCheckAndSendOtp.mockReturnValue({ data: { hasSendAttemptsRemaining: true } });
      const { result } = initialise({ verificationDetails: getMockVerificationDetails() });

      expect(result.current).toBeDefined();

      await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
      expect(result.current.onReceiveOtpViaSms).toBeDefined();

      await result.current.onReceiveOtpViaSms();
      await waitFor(() =>
        expect(mockSetFlowState).toHaveBeenCalledWith({
          isAuthenticated: false,
          hasSendAttemptsRemaining: true,
          memberStatus: VerifyOptions.HasMobile,
          selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithSMS,
        }),
      );

      expect(mockCheckAndSendOtp).toHaveBeenCalledTimes(1);
    });

    describe("ErrorHandling", () => {
      it("should set error flow state and trigger onError callback when onReceiveOtpViaSms is called and checkAndSendOtp returns undefined data", async () => {
        mockCheckAndSendOtp.mockReturnValue({ data: undefined });
        const { result } = initialise({ verificationDetails: getMockVerificationDetails() });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onReceiveOtpViaSms).toBeDefined();

        await result.current.onReceiveOtpViaSms();
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining(unhandledErrorEventDescription);

        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockCheckAndSendOtp).toHaveBeenCalledTimes(1);
      });

      it("should set error flow state and trigger onError callback when verificationDetails are undefined", async () => {
        const { result } = initialise({ verificationDetails: undefined });

        await result.current.onReceiveOtpViaSms();

        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expect(mockCheckAndSendOtp).not.toHaveBeenCalled();
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should trigger gtm event, set error flow state and trigger onError callback when checkAndSendOtp returns TooManyRequestsError", async () => {
        mockCheckAndSendOtp.mockReturnValue({ errorCode: "TooManyRequestsError" });
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({ verificationDetails });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onReceiveOtpViaSms).toBeDefined();

        await result.current.onReceiveOtpViaSms();
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining("OTP request maxed");

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndSendOtp).toHaveBeenCalled();
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should trigger gtm event, set error flow state and trigger onError callback when checkAndSendOtp returns unhandled error", async () => {
        mockCheckAndSendOtp.mockRejectedValue(new Error());
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({ verificationDetails });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onReceiveOtpViaSms).toBeDefined();

        await result.current.onReceiveOtpViaSms();
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining(unhandledErrorEventDescription);

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndSendOtp).toHaveBeenCalled();
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });
  });

  describe("OnReceiveOtpViaCall", () => {
    it("should call setFlowState when onReceiveOtpViaCall is called and checkAndSendOtp returns CheckAndSendOtpResponse", async () => {
      mockCheckAndSendOtp.mockReturnValue({ data: { hasSendAttemptsRemaining: true } });
      const { result } = initialise({ verificationDetails: getMockVerificationDetails() });

      expect(result.current).toBeDefined();

      await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
      expect(result.current.onReceiveOtpViaCall).toBeDefined();

      await result.current.onReceiveOtpViaCall();
      await waitFor(() =>
        expect(mockSetFlowState).toHaveBeenCalledWith({
          isAuthenticated: false,
          hasSendAttemptsRemaining: true,
          memberStatus: VerifyOptions.HasMobile,
          selectionStatus: NotAuthenticatedStateFlow.ReadyToVerifyWithPhoneCall,
        }),
      );

      expect(mockCheckAndSendOtp).toHaveBeenCalledTimes(1);
    });

    describe("ErrorHandling", () => {
      it("should set error flow state and trigger onError callback when verificationDetails are undefined", async () => {
        const { result } = initialise({ verificationDetails: undefined });

        await result.current.onReceiveOtpViaCall();

        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expect(mockCheckAndSendOtp).not.toHaveBeenCalled();
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should set error flow state and trigger onError callback when onReceiveOtpViaCall is called and checkAndSendOtp returns undefined data", async () => {
        mockCheckAndSendOtp.mockReturnValue({ data: undefined });
        const { result } = initialise({ verificationDetails: getMockVerificationDetails() });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onReceiveOtpViaCall).toBeDefined();

        await result.current.onReceiveOtpViaCall();
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining(unhandledErrorEventDescription);

        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockCheckAndSendOtp).toHaveBeenCalledTimes(1);
      });

      it("should trigger gtm event, set error flow state and trigger onError callback when checkAndSendOtp returns TooManyRequestsError", async () => {
        mockCheckAndSendOtp.mockReturnValue({ errorCode: "TooManyRequestsError" });
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({ verificationDetails });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onReceiveOtpViaCall).toBeDefined();

        await result.current.onReceiveOtpViaCall();
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining("OTP request maxed");

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndSendOtp).toHaveBeenCalled();
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should trigger gtm event, set error flow state and trigger onError callback when checkAndSendOtp returns unhandled error", async () => {
        mockCheckAndSendOtp.mockRejectedValue(new Error());
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({ verificationDetails });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onReceiveOtpViaCall).toBeDefined();

        await result.current.onReceiveOtpViaCall();
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining(unhandledErrorEventDescription);

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndSendOtp).toHaveBeenCalled();
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });
  });

  describe("OnSubmitVerifyOtp", () => {
    const validOtpCode = "000000";
    const invalidOtpCode = "999999";

    it("should call setFlowState when provided OTP code is correct and checkAndVerifyOtp returns CheckAndVerifyOtpResponse", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      mockCheckAndVerifyOtp.mockReturnValue({ data: { isVerified: true } });
      const verificationDetails = getMockVerificationDetails();
      const { result } = initialise({ verificationDetails });

      expect(result.current).toBeDefined();

      await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
      expect(result.current.onSubmitVerifyOtp).toBeDefined();

      await result.current.onSubmitVerifyOtp({ verificationCode: validOtpCode });
      vi.advanceTimersByTime(OTP_VERIFY_CLOSURE_DELAY);
      await waitFor(() =>
        expect(mockSetFlowState).toHaveBeenCalledWith(
          expect.objectContaining({
            isAuthenticated: true,
          }),
        ),
      );

      expectGtmCustomEventWithDescriptionContaining("Verified");

      expect(result.current.justVerified).toBe(true);
      expect(mockCheckAndVerifyOtp).toHaveBeenCalledWith(verificationDetails.sessionKey, validOtpCode);
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it("should trigger gtm event and set OneTimePasswordErrorState WrongCode when returns isVerified false", async () => {
      mockCheckAndVerifyOtp.mockReturnValue({ data: { isVerified: false } });
      const verificationDetails = getMockVerificationDetails();
      const { result } = initialise({ verificationDetails });

      expect(result.current).toBeDefined();

      await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
      expect(result.current.onSubmitVerifyOtp).toBeDefined();

      await result.current.onSubmitVerifyOtp({ verificationCode: invalidOtpCode });
      await waitFor(() => expect(result.current.oneTimePasswordError).toBe(OneTimePasswordErrorState.WrongCode));

      expectGtmCustomEventWithDescriptionContaining("OTP incorrect");

      expect(result.current.justVerified).toBe(false);
      expect(mockCheckAndVerifyOtp).toHaveBeenCalledWith(verificationDetails.sessionKey, invalidOtpCode);
      expect(mockSetFlowState).not.toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
      expect(mockOnError).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    describe("ErrorHandling", () => {
      it("should set error flow state and trigger onError callback when verificationDetails are undefined", async () => {
        const { result } = initialise({ verificationDetails: undefined });

        await result.current.onSubmitVerifyOtp({ verificationCode: validOtpCode });

        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockCheckAndSendOtp).not.toHaveBeenCalled();
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should set error flow state and trigger onError callback when checkAndVerifyOtp returns undefined data", async () => {
        mockCheckAndVerifyOtp.mockReturnValue({ data: undefined });
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({ verificationDetails });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onSubmitVerifyOtp).toBeDefined();

        await result.current.onSubmitVerifyOtp({ verificationCode: validOtpCode });
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining(unhandledErrorEventDescription);

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndVerifyOtp).toHaveBeenCalledWith(verificationDetails.sessionKey, validOtpCode);
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should trigger gtm event, set error flow state and trigger onError callback when checkAndVerifyOtp returns NotFoundError and flowState hasSendAttemptsRemaining is false", async () => {
        mockCheckAndVerifyOtp.mockResolvedValueOnce({ errorCode: "NotFoundError" });
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({
          flowState: { ...mockDefaultFlowState, hasSendAttemptsRemaining: false },
          verificationDetails,
        });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onSubmitVerifyOtp).toBeDefined();

        await result.current.onSubmitVerifyOtp({ verificationCode: validOtpCode });
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining("OTP timeout");

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndVerifyOtp).toHaveBeenCalledWith(verificationDetails.sessionKey, validOtpCode);
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should trigger gtm event and return OneTimePasswordErrorState CodeExpired when checkAndVerifyOtp returns NotFoundError and flowState hasSendAttemptsRemaining is true", async () => {
        mockCheckAndVerifyOtp.mockResolvedValueOnce({ errorCode: "NotFoundError" });
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({
          flowState: { ...mockDefaultFlowState, hasSendAttemptsRemaining: true },
          verificationDetails,
        });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onSubmitVerifyOtp).toBeDefined();

        await result.current.onSubmitVerifyOtp({ verificationCode: validOtpCode });
        await waitFor(() => expect(result.current.oneTimePasswordError).toBe(OneTimePasswordErrorState.CodeExpired));

        expectGtmCustomEventWithDescriptionContaining("OTP timeout");

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndVerifyOtp).toHaveBeenCalledWith(verificationDetails.sessionKey, validOtpCode);
        expect(mockSetFlowState).not.toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
      });

      it("should trigger gtm event, set error flow state and trigger onError callback when checkAndVerifyOtp returns TooManyRequestsError", async () => {
        mockCheckAndVerifyOtp.mockResolvedValueOnce({ errorCode: "TooManyRequestsError" });
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({ verificationDetails });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onSubmitVerifyOtp).toBeDefined();

        await result.current.onSubmitVerifyOtp({ verificationCode: validOtpCode });
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining("OTP attempts maxed");

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndVerifyOtp).toHaveBeenCalledWith(verificationDetails.sessionKey, validOtpCode);
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });

      it("should trigger gtm event, set error flow state and trigger onError callback when checkAndVerifyOtp returns unhandled error", async () => {
        mockCheckAndVerifyOtp.mockRejectedValue(new Error());
        const verificationDetails = getMockVerificationDetails();
        const { result } = initialise({ verificationDetails });

        expect(result.current).toBeDefined();

        await waitFor(() => expect(mockSetFlowState).toHaveBeenCalled());

        expect(mockOnSuccess).not.toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
        expect(result.current.onSubmitVerifyOtp).toBeDefined();

        await result.current.onSubmitVerifyOtp({ verificationCode: validOtpCode });
        await waitFor(() => expect(mockOnError).toHaveBeenCalled());

        expectGtmCustomEventWithDescriptionContaining(unhandledErrorEventDescription);

        expect(result.current.justVerified).toBe(false);
        expect(mockCheckAndVerifyOtp).toHaveBeenCalledWith(verificationDetails.sessionKey, validOtpCode);
        expect(mockSetFlowState).toHaveBeenCalledWith(expectedHandleErrorSetFlowState);
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });
  });
});
