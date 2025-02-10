import { type HttpError, type UnauthorizedAccessError, type ValidationError } from './contracts';
import { MFAChannel } from '@/components/ClientComponents/MFA/Types/MFAEnums';
import { MFAJourneyKeys } from '@/components/ClientComponents/MFA/Types/MFAJourneyKeys';
import getData from './getData';

export interface SendOtpResponse {
  errors?: Array<HttpError | UnauthorizedAccessError | ValidationError>;
  sendOtpResponse: { hasSendAttemptsRemaining: boolean };
}

export interface SendOtpMutationResponse {
  sendOtp?: SendOtpResponse;
}
const query = `
      mutation sendOTP($input: SendOtpInput!) {
        sendOtp(input: $input) {
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
          sendOtpResponse {
            hasSendAttemptsRemaining
          }
        }
      }
    `;

const variables = (channel: MFAChannel) => ({
  input: {
    request: {
      channel: channel === MFAChannel.sms ? 'SMS' : 'CALL',
      key: MFAJourneyKeys.manageContact
    }
  }
});

const sendOTP = async (channel: MFAChannel, token: string | null = null): Promise<SendOtpResponse> => {
  const result: SendOtpMutationResponse = await getData(query, token, variables(channel));

  if (!result?.sendOtp) {
    throw new Error('Error: sendOTP failed with no result');
  }
  return result.sendOtp;
};

export default sendOTP;
