export const toKebabCase = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, "-");
};
