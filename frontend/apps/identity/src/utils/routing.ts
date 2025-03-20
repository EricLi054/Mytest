export type RegistrationPage = {
  formPage: `/${"" | "match" | "link-member"}`;
  errorPage: `/${"system-unavailable" | "session-timeout" | "cant-find-you" | "lapsed-membership"}`;
};

export const getRegistrationPageUrl = ({ page }: { page: RegistrationPage["formPage"] }) =>
  `/register${page === "/" ? "" : page}` as const;

export const getRegistrationErrorPageUrl = ({ page }: { page: RegistrationPage["errorPage"] }) =>
  `/register/error${page}` as const;
