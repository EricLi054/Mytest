import verifyOTPHandler from '@/components/DataDrivenForm/handlers/verifyOTPHandler';
import { type MFAModalContentModel } from '../Content/mfaModalContent';
import { useLoadingContext } from '../../Loading/LoadingContext';
import { type HttpError, type UnauthorizedAccessError, type ValidationError } from '@/graphql/contracts';
import { verifyOTPResponse } from '../Types/MFAEnums';

export const useVerifyOTP = (content: MFAModalContentModel) => {
  const { openLoadingIndicator, closeLoadingIndicator } = useLoadingContext();

  const verifyOTP = async (otpCode: string) => {
    try {
      openLoadingIndicator(content.verifyCodeLoadingText);
      const verifyOTPResult = await verifyOTPHandler(otpCode);

      if (verifyOTPResult.errors) {
        return handleErrors(verifyOTPResult.errors);
      }

      if (verifyOTPResult.verifyOtpResponse?.isVerified === undefined) {
        return verifyOTPResponse.UnhandledError;
      }

      return verifyOTPResult.verifyOtpResponse.isVerified
        ? verifyOTPResponse.VerifySuccess
        : verifyOTPResponse.VerifyFail;
    } catch (error) {
      return verifyOTPResponse.UnhandledError;
    } finally {
      closeLoadingIndicator();
    }
  };

  return {
    verifyOTP
  };
};

const handleErrors = (errors: Array<HttpError | UnauthorizedAccessError | ValidationError>) => {
  if (IsMultipleErrors(errors)) {
    return verifyOTPResponse.UnhandledError;
  }

  if (isTokenExpiredError(errors[0])) {
    return verifyOTPResponse.TokenExpired;
  }

  if (IsTooManyRequestsError(errors[0])) {
    return verifyOTPResponse.MaxedOutVerificationAttempts;
  }

  return verifyOTPResponse.UnhandledError;
};

const IsMultipleErrors = (errors: Array<HttpError | UnauthorizedAccessError | ValidationError>) => {
  return errors.length > 1;
};

// OTP Service returns NotFound when the code has expired (i.e Auth Session not found)
const isTokenExpiredError = (error: HttpError | UnauthorizedAccessError | ValidationError): boolean => {
  if (
    '__typename' in error &&
    error.__typename === 'HttpError' &&
    'errorCode' in error &&
    error.errorCode === 'NotFound'
  ) {
    return true;
  }

  return false;
};

const IsTooManyRequestsError = (error: HttpError | UnauthorizedAccessError | ValidationError) => {
  if (
    '__typename' in error &&
    error.__typename === 'HttpError' &&
    'errorCode' in error &&
    error.errorCode === 'TooManyRequests'
  ) {
    return true;
  }

  return false;
};
