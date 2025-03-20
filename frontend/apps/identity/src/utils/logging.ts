export const annotatedLog = (component: string, message: string, sessionId?: string, crmId?: string) =>
  console.log(`[${component}]: ${message} | Session: ${sessionId ?? "-"} | CRM: ${crmId ?? "-"}`);

export const annotatedError = (
  component: string,
  message: string,
  error: unknown,
  sessionId?: string,
  crmId?: string,
) =>
  console.error(`[${component}]: ${message} | ${String(error)} | Session: ${sessionId ?? "-"} | CRM: ${crmId ?? "-"}`);
