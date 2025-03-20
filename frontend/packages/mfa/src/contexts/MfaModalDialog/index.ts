"use client";

import { createContext, useContext } from "react";

export type OnSuccessCallbackType = () => Promise<void> | void;

export type MfaModalDialogContextValue = {
  isMfaModalOpen: boolean;
  openMfaModal: (
    successCallback: OnSuccessCallbackType,
    /**
     * Customize the message that displays while the OTP verification
     * details are being retrieved and checking whether the member is
     * already authenticated before opening the OneTimePassword dialog.
     */
    customLoadingMessage?: string,
  ) => void;
  closeMfaModal: () => void;
};

export const MfaModalDialogContext = createContext<MfaModalDialogContextValue | null>(null);

export const useMfaModalDialog = () => {
  const context = useContext(MfaModalDialogContext);

  if (!context) {
    throw new Error("useMfaModalDialog must be used within a MfaModalDialogContext Provider.");
  }

  return context;
};
