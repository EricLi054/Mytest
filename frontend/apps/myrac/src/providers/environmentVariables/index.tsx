"use client";

import type { clientEnvSchema } from "#env/client";
import type { PropsWithChildren } from "react";
import type { z } from "zod";

import { EnvironmentVariableContext } from "./context";

export type EnvironmentVariableProviderProps = { variables: z.infer<typeof clientEnvSchema> } & PropsWithChildren;

export const EnvironmentVariableProvider = ({ variables, children }: EnvironmentVariableProviderProps) => {
  return <EnvironmentVariableContext.Provider value={variables}>{children}</EnvironmentVariableContext.Provider>;
};
