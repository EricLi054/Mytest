import { createContext, useContext } from "react";

export type OnSuccessCallbackType = () => Promise<void> | void;

export type MFAContext = {
  openMFAModal: (successCallback: OnSuccessCallbackType) => void;
  closeMFAModal: () => void;
};

export const MFAContext = createContext<MFAContext | null>(null);

export const useMFAContext = () => {
  const context = useContext(MFAContext);
  if (!context) {
    throw new Error("useMFAContext must be used within a MFAProvider");
  }
  return context;
};
