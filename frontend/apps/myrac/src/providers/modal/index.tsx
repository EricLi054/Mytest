"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { useState } from "react";
import { logEvent } from "#utils/analyticsTagging";

import { ModalContext } from "./context";
import { GlobalModal } from "./GlobalModal";

export type ModalProviderProps = {} & PropsWithChildren;

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closeHandler, setCloseHandler] = useState<{ closeHandler?: () => void }>();
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<ReactNode | undefined>(undefined);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const openModal = (modalTitle: string, modalContent: ReactNode, closeHandler?: () => void, fullScreen?: boolean) => {
    setModalTitle(modalTitle);
    setModalContent(modalContent);
    setCloseHandler({ closeHandler });
    setIsModalOpen(true);
    setIsFullScreen(fullScreen ?? false);
  };

  const closeModal = () => {
    setModalTitle("");
    setModalContent(undefined);
    setCloseHandler(undefined);
    setIsModalOpen(false);
    setIsFullScreen(false);
  };

  const closeModalWithEvent = (googleAnalyticsEvent: string) => {
    logEvent(googleAnalyticsEvent);
    closeModal();
  };

  const ProviderValues: ModalContext = {
    openModal,
    closeModal,
    closeModalWithEvent,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={ProviderValues}>
      <GlobalModal
        closeHandler={closeHandler}
        isModalOpen={isModalOpen}
        modalTitle={modalTitle}
        modalContent={modalContent}
        isFullScreen={isFullScreen}
      />
      {children}
    </ModalContext.Provider>
  );
};
