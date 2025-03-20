"use client";

import React from "react";

import { StyledLoadingModal } from "../styled";

export type LoadingScreenProps = {
  loading: boolean;
  loadingMessage: string | undefined;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ loading, loadingMessage }) => {
  return (
    <StyledLoadingModal
      open={loading}
      message={loadingMessage}
      id="loading-modal"
      color="primary"
      data-testid="loading-modal"
    />
  );
};
