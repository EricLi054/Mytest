import { render, screen, waitFor, waitForElementToBeRemoved, type Screen } from '@testing-library/react';
import { Button } from '@mui/material';
import { useMFAModalContext } from './Context/MFAModalContext';
import { MFAModalProvider } from './MFAModalProvider';
import { type CheckOtpResponse } from '@/graphql/checkOTP';
import { type SendOtpResponse } from '@/graphql/sendOTP';
import { type VerifyOtpResponse } from '@/graphql/verifyOTP';
import checkOTPHandler from '@/components/DataDrivenForm/handlers/checkOTPHandler';
import sendOTPHandler from '@/components/DataDrivenForm/handlers/sendOTPHandler';
import verifyOTPHandler from '@/components/DataDrivenForm/handlers/verifyOTPHandler';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import {
  getRequestCodePhoneBodyText,
  getRequestCodeSMSBodyText,
  getVerifyCodeSMSBodyText
} from './Content/mfaModalContent';
import { type HttpError } from '@/graphql/contracts';

const checkOtpMobilePhone = '0412345678';
const checkOtpLandline = '94001234';

jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

jest.mock('../../DataDrivenForm/handlers/checkOTPHandler', () => jest.fn());

jest.mock('../../DataDrivenForm/handlers/sendOTPHandler', () => jest.fn());

jest.mock('../../DataDrivenForm/handlers/verifyOTPHandler', () => jest.fn());

jest.mock('../../../graphql/getContactDetailsMetadata', () => jest.fn());

jest.mock('../../../graphql/getNameMetadata', () => jest.fn());

const mockCheckOtpIsVerifiedResponse: CheckOtpResponse = {
  checkOtpQueryResponse: {
    isVerified: true,
    mobilePhone: checkOtpMobilePhone,
    landline: checkOtpLandline
  }
};

const mockCheckOtpNotVerifiedResponse: CheckOtpResponse = {
  checkOtpQueryResponse: {
    isVerified: false,
    mobilePhone: checkOtpMobilePhone,
    landline: checkOtpLandline
  }
};

const mockSendOtpResponse: SendOtpResponse = {
  sendOtpResponse: {
    hasSendAttemptsRemaining: true
  }
};

const mockSendOtpNoAttemptsResponse: SendOtpResponse = {
  sendOtpResponse: {
    hasSendAttemptsRemaining: false
  }
};

const mockVerifyIsVerifiedOtpResponse: VerifyOtpResponse = {
  verifyOtpResponse: {
    isVerified: true
  }
};

const mockVerifyIsNotVerifiedOtpResponse: VerifyOtpResponse = {
  verifyOtpResponse: {
    isVerified: false
  }
};

const mockHTTPError: HttpError = {
  __typename: 'HttpError',
  errorCode: '500',
  message: 'error'
};

const mockExpiredCodeHTTPError: HttpError = {
  __typename: 'HttpError',
  errorCode: 'NotFound',
  message: 'Not Found'
};

const mockTooManyRequestHTTPError: HttpError = {
  __typename: 'HttpError',
  errorCode: 'TooManyRequests',
  message: 'Too Many Requests'
};

const checkOTPMock = jest.mocked(checkOTPHandler).mockReturnValue(Promise.resolve(mockCheckOtpNotVerifiedResponse));

const sendOTPMock = jest.mocked(sendOTPHandler).mockReturnValue(Promise.resolve(mockSendOtpResponse));

const verifyOTPMock = jest.mocked(verifyOTPHandler).mockReturnValue(Promise.resolve(mockVerifyIsVerifiedOtpResponse));

const routerPushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: routerPushMock
    };
  }
}));

const TestButton = () => {
  const { openMFAModal } = useMFAModalContext();

  return (
    <Button
      onClick={async () => {
        await openMFAModal();
      }}
    >
      Open
    </Button>
  );
};

describe('MFA Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    checkOTPMock.mockReturnValue(Promise.resolve(mockCheckOtpNotVerifiedResponse));
  });
  it('should not work when not wrapped in provider', async () => {
    render(
      <>
        <TestButton />
      </>
    );

    await testHelper.clickButton('Open', screen);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should default back to sms view when modal is closed and reopened', async () => {
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await testHelper.clickButton('Open', screen);
    verifyRequestCodePageRendersWhenSMSChannel(screen);

    await testHelper.clickText('Get code via phone call', screen);
    await testHelper.clickButton('close', screen);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await testHelper.clickButton('Open', screen);
    verifyRequestCodePageRendersWhenSMSChannel(screen);
  });

  it('should display correct content when changeChannel button is toggled on request code page', async () => {
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await testHelper.clickButton('Open', screen);
    verifyRequestCodePageRendersWhenSMSChannel(screen);

    await testHelper.clickText('Get code via phone call', screen);
    testHelper.verifyEventLogged('MFA - Sms - Lets verify its you - Get code via phone call');
    verifyRequestCodePageRendersWhenPhoneChannelClicked(screen);

    await testHelper.clickText('Send code via SMS', screen);
    verifyRequestCodePageRendersWhenSMSChannel(screen);
    testHelper.verifyEventLogged('MFA - Mobile call - Lets verify its you - Send code via SMS');
  });

  it('should display verify code page when send code button is clicked, also checks FAQ link', async () => {
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await testHelper.clickButton('Open', screen);
    await testHelper.clickButton('Send code', screen);
    await verifyValidateCodePageRendersWhenSMSChannel(screen);

    await testHelper.clickLink('Visit our FAQs', screen);
    testHelper.verifyEventLogged('MFA - Sms - Enter verification code - Visit our FAQs');
  });

  it('should display verify code page with Phone content when send code button is clicked after toggling channel and complete journey', async () => {
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await testHelper.clickButton('Open', screen);
    verifyRequestCodePageRendersWhenSMSChannel(screen);

    await testHelper.clickText('Get code via phone call', screen);
    testHelper.verifyEventLogged('MFA - Sms - Lets verify its you - Get code via phone call');

    await testHelper.clickButton('Request a call', screen);
    testHelper.verifyEventLogged('MFA - Mobile call - Lets verify its you - Request a call');

    await verifyValidateCodePageRendersWhenPhoneChannel(screen);
    testHelper.verifyEventLogged('MFA - Mobile call - Lets verify its you - Request a call');
    testHelper.verifyEventLogged('MFA - Mobile call - Enter verification code');

    await testHelper.inputOTPCode('123456', screen);
    testHelper.verifyEventLogged(
      'MFA - Mobile call - Enter verification code - Please enter the code to verify its you'
    );

    await testHelper.clickButton('Verify', screen);
    testHelper.verifyEventLogged('MFA - Mobile call - Verified');
  });

  it('should return to request code screen if selects to receive another phone call, also checks the FAQ link', async () => {
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await testHelper.clickButton('Open', screen);
    verifyRequestCodePageRendersWhenSMSChannel(screen);

    await testHelper.clickText('Get code via phone call', screen);
    testHelper.verifyEventLogged('MFA - Sms - Lets verify its you - Get code via phone call');

    await testHelper.clickButton('Request a call', screen);
    testHelper.verifyEventLogged('MFA - Mobile call - Lets verify its you - Request a call');
    await verifyValidateCodePageRendersWhenPhoneChannel(screen);

    await testHelper.clickText('Get another phone call', screen);
    testHelper.verifyEventLogged('MFA - Mobile call - Enter verification code - Get another phone call');
    verifyRequestCodePageRendersWhenPhoneChannelClicked(screen);

    await testHelper.clickLink('Visit our FAQs', screen);
    testHelper.verifyEventLogged('MFA - Mobile call - Lets verify its you - Visit our FAQs');
  });

  it('should navigate to request code page when changeChannel button is toggled while on verify code page', async () => {
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await testHelper.clickButton('Open', screen);
    verifyRequestCodePageRendersWhenSMSChannel(screen);

    await testHelper.clickButton('Send code', screen);
    await verifyValidateCodePageRendersWhenSMSChannel(screen);

    await testHelper.clickText('Get code via phone call', screen);
    testHelper.verifyEventLogged('MFA - Sms - Enter verification code - Get code via phone call');
    verifyRequestCodePageRendersWhenPhoneChannelClicked(screen);
  });

  it('should not trigger MFA Modal when valid OTP session exists', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpIsVerifiedResponse));
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await testHelper.clickButton('Open', screen);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(checkOTPMock).toHaveBeenCalledTimes(1);
  });

  it('should show error when verify button clicked with no otp input', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await openSendEnterVerifyOTP('', screen);

    expect(sendOTPMock).toHaveBeenCalledTimes(1);
    expect(verifyOTPMock).toHaveBeenCalledTimes(0);

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByText('Please enter a valid verification code.')).toBeVisible();
  });

  it('should show form error when verify button clicked with incorrect otp input', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));

    verifyOTPMock.mockReturnValueOnce(Promise.resolve(mockVerifyIsNotVerifiedOtpResponse));

    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await openSendEnterVerifyOTP('123456', screen);
    expect(screen.queryByText("Sorry, that code doesn't match. Please try again or request a new code.")).toBeVisible();
    expect(sendOTPMock).toHaveBeenCalledTimes(1);
    expect(verifyOTPMock).toHaveBeenCalledTimes(1);
    testHelper.verifyEventLogged('MFA - Sms - Enter verification code - OTP incorrect');
  });

  it('should close MFA Modal when verify button clicked with correct otp input', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));

    verifyOTPMock.mockReturnValueOnce(Promise.resolve(mockVerifyIsVerifiedOtpResponse));

    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await openSendEnterVerifyOTP('699443', screen);

    expect(sendOTPMock).toHaveBeenCalledTimes(1);
    expect(verifyOTPMock).toHaveBeenCalledTimes(1);

    await waitForElementToBeRemoved(screen.queryByRole('dialog'), {
      timeout: 5000
    });
    testHelper.verifyEventLogged('MFA - Sms - Verified');
  });

  it('should redirect to error page when unhandled server error occurs while checking OTP', async () => {
    checkOTPMock.mockRejectedValueOnce(new Error('Async error'));
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
  });

  it('should redirect to error page when unhandled server error occurs while sending OTP', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));
    sendOTPMock.mockRejectedValueOnce(new Error('Async error'));

    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    await testHelper.clickButton('Send code', screen);
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
  });

  it('should redirect to error page when unhandled server error occurs while verifying OTP', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));

    verifyOTPMock.mockRejectedValueOnce(new Error('Async error'));

    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await openSendEnterVerifyOTP('699443', screen);
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
    testHelper.verifyEventLogged('MFA - Server error');
  });

  it('should redirect to error page when errors returned from checkOTP endpoint', async () => {
    checkOTPMock.mockReturnValueOnce(
      Promise.resolve({
        ...mockCheckOtpNotVerifiedResponse,
        errors: [mockHTTPError]
      })
    );
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
    testHelper.verifyEventLogged('MFA - Server error');
  });

  it('should redirect to error page when errors returned from sendOTP endpoint', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));
    sendOTPMock.mockReturnValueOnce(
      Promise.resolve({
        ...mockSendOtpResponse,
        errors: [mockHTTPError]
      })
    );

    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    await testHelper.clickButton('Send code', screen);
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
    testHelper.verifyEventLogged('MFA - Server error');
  });

  it('should redirect to error page when errors returned from verifyOTP endpoint', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));

    verifyOTPMock.mockReturnValueOnce(
      Promise.resolve({
        ...mockVerifyIsNotVerifiedOtpResponse,
        errors: [mockHTTPError]
      })
    );

    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await openSendEnterVerifyOTP('699443', screen);
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
    testHelper.verifyEventLogged('MFA - Server error');
  });

  it('should display form error when submitting expired code', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));

    verifyOTPMock.mockReturnValueOnce(
      Promise.resolve({
        errors: [mockExpiredCodeHTTPError]
      })
    );

    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await openSendEnterVerifyOTP('699443', screen);
    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.queryByText('Sorry, that code has expired. Please request a new code.')).toBeVisible();

    verifyOTPInputIsDisabled(screen);
    testHelper.verifyEventLogged('MFA - Sms - Enter verification code - OTP timeout');

    // expect server error to be displayed
  });

  it('should redirect to error page when no landline or mobile numbers available', async () => {
    const mockedCheckOtpNoContactNumberResponse: CheckOtpResponse = {
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: '',
        landline: ''
      }
    };
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockedCheckOtpNoContactNumberResponse));
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
    testHelper.verifyEventLogged('MFA - MC contact information missing');
  });

  it('should display phone only options when only landline number is available', async () => {
    const mockedCheckOtpNoContactNumberResponse: CheckOtpResponse = {
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: '',
        landline: checkOtpLandline
      }
    };
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockedCheckOtpNoContactNumberResponse));
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    await verifyPhoneOnlyOptions(screen);
    testHelper.verifyEventLogged('MFA - Landline call - Lets verify its you');

    await testHelper.clickLink('13 17 03', screen);
    testHelper.verifyEventLogged('MFA - Landline call - Lets verify its you - Call 13 17 03');

    await testHelper.clickButton('Request a call', screen);
    await verifyValidateCodePageRendersWhenPhoneChannel(screen, true);
    testHelper.verifyEventLogged('MFA - Landline call - Lets verify its you - Request a call');
    testHelper.verifyEventLogged('MFA - Landline call - Enter verification code');
  });

  it('should redirect to error page after incorrect code with no attempts remaining', async () => {
    const mockedCheckOtpNoContactNumberResponse: CheckOtpResponse = {
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: '',
        landline: checkOtpLandline
      }
    };
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockedCheckOtpNoContactNumberResponse));
    sendOTPMock.mockReturnValueOnce(Promise.resolve(mockSendOtpNoAttemptsResponse));
    verifyOTPMock.mockReturnValueOnce(Promise.resolve(mockVerifyIsNotVerifiedOtpResponse));
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    testHelper.verifyEventLogged('MFA - Landline call - Lets verify its you');

    await testHelper.clickButton('Request a call', screen);
    testHelper.verifyEventLogged('MFA - Landline call - Lets verify its you - Request a call');
    testHelper.verifyEventLogged('MFA - Landline call - Enter verification code');

    await testHelper.inputOTPCode('123456', screen);
    testHelper.verifyEventLogged(
      'MFA - Landline call - Enter verification code - Please enter the code to verify its you'
    );

    await testHelper.clickButton('Verify', screen);
    testHelper.verifyEventLogged('MFA - Landline call - Enter verification code - OTP request maxed');
    testHelper.verifyEventLogged('MFA - Landline call - Enter verification code - OTP incorrect');
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
  });

  it('should log no attempts left and redirect to error page after incorrect code with no attempts remaining', async () => {
    const mockedCheckOtpNoContactNumberResponse: CheckOtpResponse = {
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: '',
        landline: checkOtpLandline
      }
    };
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockedCheckOtpNoContactNumberResponse));
    sendOTPMock.mockReturnValueOnce(Promise.resolve(mockSendOtpNoAttemptsResponse));
    verifyOTPMock.mockReturnValueOnce(
      Promise.resolve({
        errors: [mockTooManyRequestHTTPError]
      })
    );

    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    await testHelper.clickButton('Request a call', screen);
    await testHelper.inputOTPCode('123456', screen);

    await testHelper.clickButton('Verify', screen);
    testHelper.verifyEventLogged('MFA - Landline call - Enter verification code - OTP attempts maxed');
    expect(routerPushMock).toHaveBeenCalledWith('/something-went-wrong');
  });

  it('should clear otp when call link clicked', async () => {
    checkOTPMock.mockReturnValueOnce(Promise.resolve(mockCheckOtpNotVerifiedResponse));
    verifyOTPMock.mockReturnValueOnce(
      Promise.resolve({
        errors: [mockExpiredCodeHTTPError]
      })
    );
    render(
      <MFAModalProvider>
        <TestButton />
      </MFAModalProvider>
    );

    await testHelper.clickButton('Open', screen);
    await testHelper.clickButton('Send code', screen);
    await testHelper.inputOTPCode('123456', screen);
    await testHelper.clickLink('13 17 03', screen);
    testHelper.verifyEventLogged('MFA - Sms - Enter verification code - Call 13 17 03');

    verifyOTPCodeCleared(screen);
  });
});

// HELPER METHODS

const openSendEnterVerifyOTP = async (code: string, screen: Screen) => {
  await testHelper.clickButton('Open', screen);
  expect(screen.queryByRole('dialog')).toBeInTheDocument();
  testHelper.verifyEventLogged('MFA - Sms - Lets verify its you');
  await testHelper.clickButton('Send code', screen);
  testHelper.verifyEventLogged('MFA - Sms - Lets verify its you - Send code');
  testHelper.verifyEventLogged('MFA - Sms - Enter verification code');
  await testHelper.inputOTPCode(code, screen);
  if (code.length > 0)
    testHelper.verifyEventLogged('MFA - Sms - Enter verification code - Please enter the code to verify its you');
  await testHelper.clickButton('Verify', screen);
};

const verifyOTPInputIsDisabled = (screen: Screen) => {
  for (let index = 0; index < 6; index++) {
    const ariaLabel = `One time pass code input box ${index + 1}`;
    const otpInputBox = screen.getByRole('textbox', { name: ariaLabel });
    expect(otpInputBox).toBeDisabled();
  }
};

const verifyOTPCodeCleared = (screen: Screen) => {
  for (let index = 0; index < 6; index++) {
    const ariaLabel = `One time pass code input box ${index + 1}`;
    const otpInputBox = screen.getByRole('textbox', { name: ariaLabel });
    expect(otpInputBox).toHaveValue('');
  }
};

const verifyRequestCodePageRendersWhenSMSChannel = (screen: Screen) => {
  testHelper.verifyEventLogged('MFA - Sms - Lets verify its you');
  expect(screen.getByText('Let’s verify it’s you')).toBeVisible();
  const requestCodeSMSBodyText = getRequestCodeSMSBodyText(checkOtpMobilePhone);
  expect(screen.getByText(requestCodeSMSBodyText)).toBeVisible();
  expect(screen.getByText('Send code')).toBeVisible();
  expect(screen.getByText('Get code via phone call')).toBeVisible();
  expect(screen.getByText('Need help?', { exact: false })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Visit our FAQs' })).toBeVisible();
  expect(screen.getByRole('link', { name: '13 17 03' })).toBeVisible();
  expect(screen.getByRole('link', { name: '13 17 03' })).toHaveAttribute('href', 'tel:131703');
};

const verifyRequestCodePageRendersWhenPhoneChannelClicked = (screen: Screen) => {
  testHelper.verifyEventLogged('MFA - Mobile call - Lets verify its you');
  expect(screen.getByText('Let’s verify it’s you')).toBeVisible();
  const requestCodePhoneBodyText = getRequestCodePhoneBodyText(checkOtpMobilePhone);
  expect(screen.getByText(requestCodePhoneBodyText)).toBeVisible();
  expect(screen.getByText('Request a call')).toBeVisible();
  expect(screen.getByText('Send code via SMS')).toBeVisible();
  expect(screen.getByText('Need help?', { exact: false })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Visit our FAQs' })).toBeVisible();
  expect(screen.getByRole('link', { name: '13 17 03' })).toBeVisible();
  expect(screen.getByRole('link', { name: '13 17 03' })).toHaveAttribute('href', 'tel:131703');
};

const verifyValidateCodePageRendersWhenSMSChannel = async (screen: Screen) => {
  await waitFor(
    () => {
      expect(screen.getByText('Enter verification code')).toBeVisible();
    },
    { timeout: 5000 }
  );
  testHelper.verifyEventLogged('MFA - Sms - Lets verify its you - Send code');
  testHelper.verifyEventLogged('MFA - Sms - Enter verification code');
  const verifyCodeSMSBodyText = getVerifyCodeSMSBodyText(checkOtpMobilePhone);
  expect(screen.getByText(verifyCodeSMSBodyText)).toBeVisible();
  expect(
    screen.getByRole<HTMLButtonElement>('button', {
      name: 'Verify'
    })
  ).toBeVisible();
  expect(screen.getByText('Need help?')).toBeVisible();
  expect(screen.getByText('Get code via phone call')).toBeVisible();
  expect(screen.getByRole('link', { name: '13 17 03' })).toHaveAttribute('href', 'tel:131703');
};

const verifyValidateCodePageRendersWhenPhoneChannel = async (screen: Screen, phoneOnly: boolean = false) => {
  await waitFor(() => {
    expect(screen.getByText('Enter verification code')).toBeVisible();
  });

  expect(screen.getByText('Please enter the code to verify it’s you.')).toBeVisible();
  expect(
    screen.getByRole<HTMLButtonElement>('button', {
      name: 'Verify'
    })
  ).toBeVisible();

  if (!phoneOnly) {
    expect(screen.getByText('Send code via SMS')).toBeVisible();
  }
  expect(screen.getByText('Need help?')).toBeVisible();

  expect(screen.getByRole('link', { name: '13 17 03' })).toHaveAttribute('href', 'tel:131703');
};

const verifyPhoneOnlyOptions = async (screen: Screen) => {
  expect(screen.getByText('Let’s verify it’s you')).toBeVisible();
  expect(screen.queryByText('Get code via phone call')).not.toBeInTheDocument();
  expect(screen.queryByText('Send code via SMS')).not.toBeInTheDocument();

  expect(screen.getByText('Need help?', { exact: false })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Visit our FAQs' })).toBeVisible();
  expect(screen.getByRole('link', { name: '13 17 03' })).toBeVisible();
  expect(screen.getByRole('link', { name: '13 17 03' })).toHaveAttribute('href', 'tel:131703');
};
