type Environment = "SIT" | "UAT";

const envUrls = {
  SIT: process.env.PLAYWRIGHT_BASE_SIT_URL,
  UAT: process.env.PLAYWRIGHT_BASE_UAT_URL,
} as const;

console.log("Environment variables in urls.ts:", {
  PLAYWRIGHT_ENV: process.env.PLAYWRIGHT_ENV,
  PLAYWRIGHT_BASE_SIT_URL: process.env.PLAYWRIGHT_BASE_SIT_URL,
  PLAYWRIGHT_BASE_UAT_URL: process.env.PLAYWRIGHT_BASE_UAT_URL,
});

export const getCurrentEnv = (): Environment => {
  const env = (process.env.PLAYWRIGHT_ENV?.toUpperCase() as Environment) || "SIT";
  console.log("Current environment:", env);
  return env;
};

export const getBaseUrl = (): string => {
  const env = getCurrentEnv();
  const baseUrl = envUrls[env];

  if (!baseUrl) {
    throw new Error(`Base URL for ${env} environment is not defined`);
  }

  return baseUrl;
};

export const baseURL = getBaseUrl();

export const urls = {
  landing: `${baseURL}/myrac`,
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
