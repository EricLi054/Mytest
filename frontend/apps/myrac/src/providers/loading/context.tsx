import { createContext, useContext } from "react";

export type LoadingContext = {
  openLoadingIndicator: (message?: string) => void;
  closeLoadingIndicator: () => void;
};

export const LoadingContext = createContext<LoadingContext | null>(null);

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingContext must be used within a LoadingProvider");
  }
  return context;
};
