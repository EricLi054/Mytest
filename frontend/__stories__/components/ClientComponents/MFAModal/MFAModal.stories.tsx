import { MFAModal } from '@/components/ClientComponents/MFA/MFAModal';
import { defaultMFAModalContent } from '@/components/ClientComponents/MFA/Content/mfaModalContent';
import { Button } from '@mui/material';
import { expect, screen, userEvent, waitFor } from '@storybook/test';
import { type Meta } from '@storybook/react';
import { useMFAModalContext } from '@/components/ClientComponents/MFA/Context/MFAModalContext';
import { MockMFAModalProvider } from './MockMFAModalProvider';
import { verifyOTPResponse } from '@/components/ClientComponents/MFA/Types/MFAEnums';

const meta: Meta<typeof MFAModal> = {
  title: 'Components/Client Components/MFA Modal',
  component: MFAModal,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100%' }}>
        <Story />
      </div>
    )
  ]
};
export default meta;

const clickButton = async (name: string) => {
  const button = screen.getByRole('button', { name });
  await userEvent.click(button);
};

const clickText = async (text: string) => {
  const textElement = screen.getByText(text);
  await userEvent.click(textElement);
};

const waitForTextVisible = async (text: string) => {
  await waitFor(async () => {
    await expect(screen.getByText(text)).toBeInTheDocument();
  });
};

const inputOTPCode = async (otpInput: string) => {
  for (let index = 0; index < otpInput.length; index++) {
    const digitInput = screen.getByTestId(`input-otp-${index}`);
    await userEvent.type(digitInput, otpInput[index]);
  }
};

const OpenButton = () => {
  const { openMFAModal } = useMFAModalContext();
  return (
    <Button
      color='primary'
      onClick={async () => {
        await openMFAModal();
      }}
    >
      Open modal
    </Button>
  );
};

export const RequestCodeSMS = () => {
  return (
    <MockMFAModalProvider mobilePhone='04** *** 000'>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
RequestCodeSMS.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
};

export const RequestCodePhone = () => {
  return (
    <MockMFAModalProvider mobilePhone='04** *** 000'>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
RequestCodePhone.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
  await clickText('Get code via phone call');
};

export const RequestCodePhoneOnly = () => {
  return (
    <MockMFAModalProvider landline='08** *** 000'>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
RequestCodePhoneOnly.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
};

export const VerifyCode = () => {
  return (
    <MockMFAModalProvider mobilePhone='04** *** 000'>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
VerifyCode.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
  await clickButton('Send code');
  await waitForTextVisible(defaultMFAModalContent.verifyCodeModalTitle);
};

export const VerifyCodePhoneOnly = () => {
  return (
    <MockMFAModalProvider landline='08** *** 000'>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
VerifyCodePhoneOnly.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
  await clickButton('Request a call');
  await waitForTextVisible(defaultMFAModalContent.verifyCodeModalTitle);
};

export const VerifyCodeIncorrect = () => {
  return (
    <MockMFAModalProvider mobilePhone='04** *** 000'>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
VerifyCodeIncorrect.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
  await clickButton('Send code');
  await waitForTextVisible(defaultMFAModalContent.verifyCodeModalTitle);
  await clickButton('Verify');
};

export const VerifyCodeExpired = () => {
  return (
    <MockMFAModalProvider mobilePhone='04** *** 000' verifyResult={verifyOTPResponse.TokenExpired}>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
VerifyCodeExpired.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
  await clickButton('Send code');
  await waitForTextVisible(defaultMFAModalContent.verifyCodeModalTitle);
  await inputOTPCode('123456');
  await clickButton('Verify');
};

export const VerifyCodeFailed = () => {
  return (
    <MockMFAModalProvider mobilePhone='04** *** 000' verifyResult={verifyOTPResponse.VerifyFail}>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
VerifyCodeFailed.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
  await clickButton('Send code');
  await waitForTextVisible(defaultMFAModalContent.verifyCodeModalTitle);
  await inputOTPCode('123456');
  await clickButton('Verify');
};

export const VerifyCodeLoading = () => {
  return (
    <MockMFAModalProvider mobilePhone='04** *** 000' bypassVerification={true}>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
VerifyCodeLoading.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
  await clickButton('Send code');
  await waitForTextVisible(defaultMFAModalContent.verifyCodeModalTitle);
  await inputOTPCode('123456');
  await clickButton('Verify');
};

export const VerifyCodeSuccess = () => {
  return (
    <MockMFAModalProvider mobilePhone='04** *** 000'>
      <OpenButton />
    </MockMFAModalProvider>
  );
};
VerifyCodeSuccess.play = async () => {
  await clickButton('Open modal');
  await waitForTextVisible(defaultMFAModalContent.requestCodeModalTitle);
  await clickButton('Send code');
  await waitForTextVisible(defaultMFAModalContent.verifyCodeModalTitle);
  await inputOTPCode('123456');
  await clickButton('Verify');
};
