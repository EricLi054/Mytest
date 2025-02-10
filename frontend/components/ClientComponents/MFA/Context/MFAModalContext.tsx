'use client';

import { createContext, useContext } from 'react';
import { defaultMFAModalContent, type MFAModalContentModel } from '../Content/mfaModalContent';
import { MFAVerificationState, type MFAState, type MFAChannel } from '../Types/MFAEnums';

export interface IMFAModalContext {
  openMFAModal: (onVerifyTokenSuccess?: () => Promise<void>) => void | Promise<void>;
  closeMFAModal: () => void;
  contentDefinition: MFAModalContentModel;
  channel: MFAChannel | null;
  mfaState: MFAState | null;
  mfaVerificationState: MFAVerificationState;
  isPhoneOnly: boolean;
  hasSendAttemptsRemaining: boolean;
  isMFAModalOpen: boolean;
  handleMFAModalCancelled: () => void;
  handleMFASendCodeClick: () => Promise<void>;
  handleMFAChangeChannel: () => void;
  handleMFAResendCodeClick: () => void;
  handleMFAVerifyCodeClick: (otpCode: string) => Promise<unknown>;
}

export const MFAModalContext = createContext<IMFAModalContext>({
  openMFAModal: () => {},
  closeMFAModal: () => {},
  contentDefinition: defaultMFAModalContent,
  channel: null,
  mfaState: null,
  mfaVerificationState: MFAVerificationState.initial,
  isPhoneOnly: false,
  hasSendAttemptsRemaining: false,
  isMFAModalOpen: false,
  handleMFAModalCancelled: () => {},
  handleMFASendCodeClick: async () => {},
  handleMFAChangeChannel: () => {},
  handleMFAResendCodeClick: () => {},
  handleMFAVerifyCodeClick: async () => {}
});
MFAModalContext.displayName = 'MFAModalContext';

export const useMFAModalContext = () => {
  const context = useContext<IMFAModalContext>(MFAModalContext);
  // if context is undefined this means it was used outside of its provider
  if (!context) {
    throw new Error('useMFAModalContext must be used under <MFAModalContextProvider/>');
  }
  return context;
};
