import { isRedirectError } from "next/dist/client/components/redirect-error";

export const log = (component: string, message: string, correlationId: string, crmId?: string) =>
  console.log(`[${component}]: ${message} | CorrelationID: ${correlationId} | CRM: ${crmId ?? "unknown"}`);

export const logError = (
  error: unknown,
  component: string,
  message: string,
  correlationId?: string,
  crmId?: string,
) => {
  if (!isRedirectError(error)) {
    const errorMessage = error instanceof Error ? error.message : error;
    console.error(
      [
        "[",
        component,
        "]: ",
        message,
        " | CorrelationID: ",
        correlationId ?? "unknown",
        " | CRM: ",
        crmId ?? "unknown",
      ].join(""),
      errorMessage,
    );
  }
};
