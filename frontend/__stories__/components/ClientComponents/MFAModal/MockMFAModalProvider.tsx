'use client';

import { type PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { MFAModal } from '@/components/ClientComponents/MFA/MFAModal';
import {
  defaultMFAModalContent,
  getRequestCodePhoneBodyText,
  getRequestCodeSMSBodyText,
  getVerifyCodeSMSBodyText,
  type MFAModalContentModel
} from '@/components/ClientComponents/MFA/Content/mfaModalContent';
import {
  MFAChannel,
  MFAState,
  MFAVerificationState,
  verifyOTPResponse
} from '@/components/ClientComponents/MFA/Types/MFAEnums';
import { MFAFormSubmitError } from '@/components/ClientComponents/MFA/Form/MFAForm';
import { type IMFAModalContext, MFAModalContext } from '@/components/ClientComponents/MFA/Context/MFAModalContext';

export interface MockMFAModalProviderProps extends PropsWithChildren {
  mobilePhone?: string;
  landline?: string;
  bypassVerification?: boolean;
  verifyResult?: verifyOTPResponse;
  hasSendAttemptsRemaining?: boolean;
}

export const MockMFAModalProvider: React.FC<MockMFAModalProviderProps> = ({
  mobilePhone = '',
  landline = '',
  bypassVerification = false,
  verifyResult = verifyOTPResponse.VerifySuccess,
  hasSendAttemptsRemaining = true,
  children
}) => {
  const [isMFAModalOpen, setIsMFAModalOpen] = useState(false);
  const [mfaState, setMfaState] = useState<MFAState>(MFAState.requestCode);
  const [isPhoneOnly, setIsPhoneOnly] = useState(false);
  const [channel, setChannel] = useState(MFAChannel.sms);
  const [contentDefinition, setContentDefinition] = useState<MFAModalContentModel>(defaultMFAModalContent);
  const [mfaVerificationState, setMfaVerificationState] = useState<MFAVerificationState>(MFAVerificationState.initial);

  const resetMFAChannel = useCallback(() => {
    if (isPhoneOnly) {
      setChannel(MFAChannel.phone);
    } else {
      setChannel(channel);
    }
  }, [isPhoneOnly, channel]);

  useEffect(() => {
    resetMFAChannel();
  }, [mfaState, resetMFAChannel]);

  useEffect(() => {
    setIsPhoneOnly(mobilePhone === '' && landline !== '');
    setContentDefinition({
      ...defaultMFAModalContent,
      ...{
        requestCodeSMSBodyText: getRequestCodeSMSBodyText(mobilePhone),
        verifyCodeSMSBodyText: getVerifyCodeSMSBodyText(mobilePhone),
        requestCodePhoneBodyText: getRequestCodePhoneBodyText(mobilePhone || landline)
      }
    });
  }, [mobilePhone, landline]);

  const resetMFAState = () => {
    setMfaState(MFAState.requestCode);
    setMfaVerificationState(MFAVerificationState.initial);
    setChannel(MFAChannel.sms);
  };

  const closeMFAModal = () => {
    setIsMFAModalOpen(false);
  };

  const openMFAModal = async (onSuccess?: () => Promise<void>) => {
    setIsMFAModalOpen(true);
  };

  const handleMFASendCodeClick = async () => {
    setMfaState(MFAState.verifyCode);
  };

  const handleMFAVerifyCodeClick = async (otpCode: string): Promise<unknown> => {
    setMfaVerificationState(MFAVerificationState.Verifying);

    if (bypassVerification) return;

    if (verifyResult === verifyOTPResponse.TokenExpired) {
      setMfaVerificationState(MFAVerificationState.VerifyFail);
      return MFAFormSubmitError(defaultMFAModalContent.otpFieldExpiredCodeMessage);
    }

    if (verifyResult === verifyOTPResponse.VerifyFail) {
      setMfaVerificationState(MFAVerificationState.initial);
      return MFAFormSubmitError(defaultMFAModalContent.otpFieldFailedVerificationMessage);
    }

    if (verifyResult === verifyOTPResponse.VerifySuccess) {
      setMfaVerificationState(MFAVerificationState.Verified);
    }
  };

  const handleMFAChangeChannel = () => {
    setChannel(channel === MFAChannel.sms ? MFAChannel.phone : MFAChannel.sms);
    setMfaState(MFAState.requestCode);
    setMfaVerificationState(MFAVerificationState.initial);
  };

  const handleMFAResendCodeClick = () => {
    setMfaState(MFAState.requestCode);
    setMfaVerificationState(MFAVerificationState.initial);
  };

  const handleMFAModalCancelled = () => {
    resetMFAState();
    closeMFAModal();
  };

  const ProviderValues: IMFAModalContext = {
    openMFAModal,
    closeMFAModal,
    channel,
    contentDefinition,
    mfaState,
    mfaVerificationState,
    hasSendAttemptsRemaining,
    isPhoneOnly,
    isMFAModalOpen,
    handleMFAModalCancelled,
    handleMFASendCodeClick,
    handleMFAChangeChannel,
    handleMFAResendCodeClick,
    handleMFAVerifyCodeClick
  };

  return (
    <MFAModalContext.Provider value={ProviderValues}>
      <MFAModal />
      {children}
    </MFAModalContext.Provider>
  );
};
