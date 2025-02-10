'use client';

import { type PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { MFAModal } from './MFAModal';
import {
  defaultMFAModalContent,
  getMFAChangeChannelString,
  getMfaChannelString,
  getMFAResendCodeString,
  getMFASendCodeString,
  getMFAStepString,
  getRequestCodePhoneBodyText,
  getRequestCodeSMSBodyText,
  getVerifyCodeSMSBodyText,
  type MFAModalContentModel
} from './Content/mfaModalContent';
import { MFAChannel, MFAState, MFAVerificationState, verifyOTPResponse } from './Types/MFAEnums';
import { MFAFormSubmitError } from './Form/MFAForm';
import { useCheckOTP } from './Hooks/useCheckOTP';
import { useSendOTP } from './Hooks/useSendOTP';
import { useVerifyOTP } from './Hooks/useVerifyOTP';
import { wait } from '@/utilities/wait';
import { useRouter } from 'next/navigation';
import { type IMFAModalContext, MFAModalContext } from './Context/MFAModalContext';
import { errorPage } from '@/utilities/errorPage';
import { logEvent } from '@/utilities/analyticsTagging';

const delayBeforeModalClose = 1500;

export const MFAModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMFAModalOpen, setIsMFAModalOpen] = useState(false);
  const [mfaState, setMfaState] = useState<MFAState>(MFAState.requestCode);
  const [isPhoneOnly, setIsPhoneOnly] = useState(false);
  const [channel, setChannel] = useState(MFAChannel.sms);
  const [contentDefinition, setContentDefinition] = useState<MFAModalContentModel>(defaultMFAModalContent);
  const [mfaVerificationState, setMfaVerificationState] = useState<MFAVerificationState>(MFAVerificationState.initial);
  const [successCallback, setSuccessCallback] = useState<{
    successCallback?: () => Promise<void>;
  }>();

  const router = useRouter();

  const { checkOTP, mobilePhone, landline } = useCheckOTP();
  const { sendOTP, hasSendAttemptsRemaining } = useSendOTP(defaultMFAModalContent, channel);
  const { verifyOTP } = useVerifyOTP(defaultMFAModalContent);

  const resetMFAChannel = useCallback(() => {
    if (isPhoneOnly) {
      setChannel(MFAChannel.phone);
    } else {
      setChannel(channel);
    }
  }, [isPhoneOnly, channel]);

  useEffect(() => {
    resetMFAChannel();
  }, [mobilePhone, landline, mfaState, resetMFAChannel]);

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
    if (onSuccess) {
      setSuccessCallback({ successCallback: onSuccess });
    }
    const checkOTPResult = await checkOTP();

    if (!checkOTPResult?.checkOtpQueryResponse) {
      return;
    }

    if (checkOTPResult.checkOtpQueryResponse.isVerified) {
      return await onSuccess?.();
    }

    const phoneOnly =
      checkOTPResult.checkOtpQueryResponse?.mobilePhone === '' && checkOTPResult.checkOtpQueryResponse?.landline !== '';
    logEvent(
      `${getMfaChannelString(phoneOnly ? MFAChannel.phone : channel, phoneOnly)} - ${getMFAStepString(mfaState, mfaVerificationState)}`
    );
    setIsMFAModalOpen(true);
  };

  const handleMFASendCodeClick = async () => {
    logEvent(
      `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(mfaState, mfaVerificationState)} - ${getMFASendCodeString(channel)}`
    );
    const sendOTPResult = await sendOTP(channel);

    if (!sendOTPResult) {
      return;
    }
    setMfaState(MFAState.verifyCode);
    logEvent(
      `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(MFAState.verifyCode, MFAVerificationState.initial)}`
    );
  };

  const handleMFAVerifyCodeClick = async (otpCode: string): Promise<unknown> => {
    setMfaVerificationState(MFAVerificationState.Verifying);
    if (!hasSendAttemptsRemaining) {
      logEvent(
        `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(mfaState, mfaVerificationState)} - ${contentDefinition.otpRequestMaxedAnalyticsText}`
      );
    }
    const verifyResult = await verifyOTP(otpCode);
    if (verifyResult === verifyOTPResponse.MaxedOutVerificationAttempts) {
      logEvent(
        `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(mfaState, mfaVerificationState)} - ${contentDefinition.otpAttemptsMaxedAnalyticsText}`
      );
      router.push(errorPage.somethingWentWrong);
      return;
    }

    if (verifyResult === verifyOTPResponse.UnhandledError) {
      logEvent(contentDefinition.serverErrorAnalyticsText);
      router.push(errorPage.somethingWentWrong);
      return;
    }

    if (verifyResult === verifyOTPResponse.TokenExpired) {
      logEvent(
        `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(mfaState, mfaVerificationState)} - ${contentDefinition.otpTimeoutAnalyticsText}`
      );
      if (!hasSendAttemptsRemaining) router.push(errorPage.somethingWentWrong);

      setMfaVerificationState(MFAVerificationState.VerifyFail);
      return MFAFormSubmitError(defaultMFAModalContent.otpFieldExpiredCodeMessage);
    }

    if (verifyResult === verifyOTPResponse.VerifyFail) {
      logEvent(
        `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(mfaState, mfaVerificationState)} - ${contentDefinition.otpIncorrectAnalyticsText}`
      );
      if (!hasSendAttemptsRemaining) router.push(errorPage.somethingWentWrong);

      setMfaVerificationState(MFAVerificationState.initial);
      return MFAFormSubmitError(defaultMFAModalContent.otpFieldFailedVerificationMessage);
    }

    if (verifyResult === verifyOTPResponse.VerifySuccess) {
      setMfaVerificationState(MFAVerificationState.Verified);
      logEvent(
        `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(mfaState, MFAVerificationState.Verified)}`
      );
      await wait(delayBeforeModalClose);
      closeMFAModal();
      resetMFAState();
      await successCallback?.successCallback?.();
    }
  };

  const handleMFAChangeChannel = () => {
    logEvent(
      `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(mfaState, mfaVerificationState)} - ${getMFAChangeChannelString(channel)}`
    );
    setChannel(channel === MFAChannel.sms ? MFAChannel.phone : MFAChannel.sms);
    setMfaState(MFAState.requestCode);
    setMfaVerificationState(MFAVerificationState.initial);
    logEvent(
      `${getMfaChannelString(channel === MFAChannel.sms ? MFAChannel.phone : MFAChannel.sms, false)} - ${getMFAStepString(MFAState.requestCode, MFAVerificationState.initial)}`
    );
  };

  const handleMFAResendCodeClick = () => {
    logEvent(
      `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(mfaState, mfaVerificationState)} - ${getMFAResendCodeString(channel)}`
    );
    setMfaState(MFAState.requestCode);
    setMfaVerificationState(MFAVerificationState.initial);
    logEvent(
      `${getMfaChannelString(channel, isPhoneOnly)} - ${getMFAStepString(MFAState.requestCode, MFAVerificationState.initial)}`
    );
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
