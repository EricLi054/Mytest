"use client";

import type { ReactNode } from "react";
import React from "react";

import { StyledGlobalModal } from "../styled";

export type GlobalModalProps = {
  closeHandler: { closeHandler?: () => void } | undefined;
  isModalOpen: boolean;
  modalTitle: string;
  modalContent: ReactNode | undefined;
  isFullScreen: boolean;
};

export const GlobalModal: React.FC<GlobalModalProps> = ({
  closeHandler,
  isModalOpen,
  modalTitle,
  modalContent,
  isFullScreen,
}) => {
  return (
    <StyledGlobalModal
      id={"global-modal"}
      open={isModalOpen}
      onClose={closeHandler ? closeHandler.closeHandler : undefined}
      onClickClose={closeHandler ? closeHandler.closeHandler : undefined}
      title={modalTitle}
      titleId={"global-modal-title"}
      titleVariant="h2"
      isFullScreen={isFullScreen}
    >
      {modalContent}
    </StyledGlobalModal>
  );
};
