import { createMfaSessionKey } from "#utils/index";

import type { OtpVerificationDetails } from "../types";
import type { FlowValues } from "../types/internal";
import { NotAuthenticatedStateFlow, VerifyOptions } from "../types/internal";

/**
 * Gets the mock DefaultFlowState
 * which should always match the
 * DefaultFlowState defined in
 * '../contexts/OtpFlowState'
 */
export const getMockDefaultFlowState = () => {
  const mockDefaultFlowState: FlowValues = {
    isAuthenticated: false,
    hasSendAttemptsRemaining: true,
    memberStatus: VerifyOptions.HasMobile,
    selectionStatus: NotAuthenticatedStateFlow.SMSVerificationOption,
  };
  return mockDefaultFlowState;
};

export const getMockVerificationDetails = (isAuthenticated = false) => {
  const mockVerificationDetails: OtpVerificationDetails = {
    sessionKey: createMfaSessionKey("my-rac-account-registration", crypto.randomUUID()),
    isAuthenticated,
    isMobile: true,
    phoneNumberSuffix: "123",
  };
  return mockVerificationDetails;
};
