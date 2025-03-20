import type { MfaJourneyTypeValue } from "../types";

/**
 * Create a session key that the RACI MFA OTP Service
 * will use to uniquely identify an member's MFA session.
 *
 * @param journeyType - The type of MFA journey
 * @param sessionId - The unique session ID
 */
export const createMfaSessionKey = (journeyType: MfaJourneyTypeValue, sessionId: string) => {
  if (!sessionId.trim()) {
    throw new Error("Session ID is required");
  }
  return `${journeyType}-${sessionId}`;
};
