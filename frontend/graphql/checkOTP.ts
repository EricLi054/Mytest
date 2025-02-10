import { MFAJourneyKeys } from '@/components/ClientComponents/MFA/Types/MFAJourneyKeys';
import getData from './getData';
import { type HttpError, type UnauthorizedAccessError, type ValidationError } from './contracts';

export interface CheckOtpResponse {
  errors?: Array<HttpError | UnauthorizedAccessError | ValidationError>;
  checkOtpQueryResponse?: {
    isVerified: boolean;
    mobilePhone: string | undefined;
    landline: string | undefined;
  };
}

export interface CheckOtpQueryResponse {
  checkOtp?: CheckOtpResponse;
}

const query = `
query checkOTP($input: CheckOtpQueryInput!, $sessionKey: String!) {
  checkOtp(request: $input) {
    isVerified
  }
  person(sessionKey: $sessionKey) {
    mobilePhone
    homePhone
  }
}
    `;

const variables = {
  input: {
    key: MFAJourneyKeys.manageContact
  },
  sessionKey: MFAJourneyKeys.manageContact
};

const checkOTP = async (token: string | null = null): Promise<CheckOtpResponse> => {
  const result: any = await getData(query, token, variables);
  if (!result?.checkOtp) {
    throw new Error('Error: CheckOTP Failed with no result');
  }

  const checkOptResult = result.checkOtp;
  const personResult = result.person;

  return {
    errors: result?.error,
    checkOtpQueryResponse: {
      isVerified: checkOptResult.isVerified,
      mobilePhone: personResult.mobilePhone,
      landline: personResult.homePhone
    }
  };
};

export default checkOTP;
