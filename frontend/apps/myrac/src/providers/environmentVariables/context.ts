import type { clientEnvSchema } from "#env/client";
import type { z } from "zod";
import { createContext, useContext } from "react";

export const EnvironmentVariableContext = createContext<z.infer<typeof clientEnvSchema> | null>(null);

export const useEnvironmentVariables = () => {
  const context = useContext(EnvironmentVariableContext);
  if (!context) {
    throw new Error("useEnvironmentVariables must be used within a EnvironmentVariableProvider");
  }
  return context;
};
