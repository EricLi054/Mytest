import { type HttpError, type UnauthorizedAccessError, type ValidationError } from './contracts';
import { MFAJourneyKeys } from '@/components/ClientComponents/MFA/Types/MFAJourneyKeys';
import getData from './getData';
export interface VerifyOtpResponse {
  errors?: Array<HttpError | UnauthorizedAccessError | ValidationError>;
  verifyOtpResponse?: { isVerified: boolean };
}

export interface VerifyOtpMutationResponse {
  verifyOtp?: VerifyOtpResponse;
}

const query = `
mutation verifyOTP($input: VerifyOtpInput!) {
  verifyOtp(input: $input) {
    verifyOtpResponse {
      isVerified
    }
    errors {
      ... on HttpError {
        __typename
        errorCode
        message
      }
      ... on UnauthorizedAccessError {
        __typename
        message
      }
      ... on ValidationError {
        __typename
        fieldName
        message
      }
    }
  }
}
    `;

const variables = (otpCode: string) => ({
  input: {
    request: { code: otpCode, key: MFAJourneyKeys.manageContact }
  }
});

const verifyOTP = async (otpCode: string, token: string | null = null) => {
  const result: VerifyOtpMutationResponse = await getData(query, token, variables(otpCode));

  if (!result?.verifyOtp) {
    throw new Error('Error: verifyOTP failed with no result');
  }
  return result.verifyOtp;
};

export default verifyOTP;
