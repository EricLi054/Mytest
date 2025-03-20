import type { ReactNode } from "react";
import { createContext, useContext } from "react";

export type ModalContext = {
  openModal: (modalTitle: string, modalContent: ReactNode, closeHandler?: () => void, fullScreen?: boolean) => void;
  closeModal: () => void;
  closeModalWithEvent: (googleAnalyticsEvent: string) => void;
  isModalOpen: boolean;
};

export const ModalContext = createContext<ModalContext | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};
