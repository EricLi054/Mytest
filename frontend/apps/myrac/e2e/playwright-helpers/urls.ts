export type MyRacPage =
  | "/"
  | "/profile"
  | "/your-contact-details"
  | "/membership"
  | "/request-plastic-card"
  | "/lapsed-membership"
  | `/profile`;

export const urls = {
  landing: "/",
  login: "/login",
  logout: "/logout",
  myrac: "/myrac",
  profile: "/profile",
  contactDetails: "/your-contact-details",
  membership: "/membership",
  requestPlasticCard: "/request-plastic-card",
  lapsedMembership: "/lapsed-membership",
  somethingWentWrong: `/something-went-wrong`,
  faq: `/myrac/help`,
  lifeInsurance: `/myrac/products/life-insurance`,
} as const;

export const myracUrl = (page: MyRacPage) => `/myrac${page}` as const;

// For backward compatibility
export const loginPageURL = urls.login;
export const landingPageURL = urls.landing;
export const contactDetailsPageURL = urls.contactDetails;
export const somethingWentWrongPageURL = urls.somethingWentWrong;
export const faqPageURL = urls.faq;
export const lifeInsurancePageURL = urls.lifeInsurance;
