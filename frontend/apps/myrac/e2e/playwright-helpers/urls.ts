type Environment = "SIT" | "UAT";

export const getCurrentEnv = (): Environment => {
  const env = process.env.PLAYWRIGHT_ENV?.toUpperCase();
  if (env !== "SIT" && env !== "UAT") {
    return "SIT";
  }
  return env;
};

export const getBaseUrl = (): string => {
  const env = getCurrentEnv();
  switch (env) {
    case "SIT":
      return process.env.PLAYWRIGHT_BASE_SIT_URL ?? "";
    case "UAT":
      return process.env.PLAYWRIGHT_BASE_UAT_URL ?? "";
    default:
      throw new Error("The environment is not correct, and no valid URL can be determined.");
  }
};

export const baseURL: string = getBaseUrl();

export const urls = {
  landing: `${baseURL}`,
  login: "https://login*.rac*.com.au/**",
  logout: `${baseURL}/logout`,
  contactDetails: `${baseURL}/myrac/profile/contact-details`,
  updateMyDetails: {
    base: `${baseURL}/myrac/update-my-details`,
    wildcard: "**/update-my-details?**",
  },
  somethingWentWrong: `${baseURL}/something-went-wrong`,
  faq: `${baseURL}/myrac/help`,
  lifeInsurance: `${baseURL}/myrac/products/life-insurance`,
};

// For backward compatibility
export const loginPageURL = urls.login;
export const landingPageURL = urls.landing;
export const contactDetailsPageURL = urls.contactDetails;
export const updateMyDetailsPageBaseURL = urls.updateMyDetails.base;
export const updateMyDetailsPageURLWildcard = urls.updateMyDetails.wildcard;
export const somethingWentWrongPageURL = urls.somethingWentWrong;
export const faqPageURL = urls.faq;
export const lifeInsurancePageURL = urls.lifeInsurance;
