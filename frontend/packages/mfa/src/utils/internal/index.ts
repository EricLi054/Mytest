export const createId = (prefix: string, suffix: string) => {
  const sanitizedPrefix = prefix.trim();
  const sanitizedSuffix = suffix.trim();
  return sanitizedPrefix.length > 0 ? `${sanitizedPrefix}-${sanitizedSuffix}` : sanitizedSuffix;
};
