"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";

import { LoadingContext } from "./context";
import { LoadingScreen } from "./LoadingScreen";

export type LoadingProviderProps = {} & PropsWithChildren;

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);

  const openLoadingIndicator = (message?: string) => {
    setLoading(true);
    setLoadingMessage(message);
  };

  const closeLoadingIndicator = () => {
    setLoading(false);
    setLoadingMessage(undefined);
  };

  const ProviderValues: LoadingContext = {
    openLoadingIndicator,
    closeLoadingIndicator,
  };

  return (
    <LoadingContext.Provider value={ProviderValues}>
      <LoadingScreen loading={loading} loadingMessage={loadingMessage} />
      {children}
    </LoadingContext.Provider>
  );
};
