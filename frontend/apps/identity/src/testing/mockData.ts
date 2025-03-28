import type { LinkProps } from "@mui/material";

import type { FooterProps } from "@racwa/react-components";

/** RacwaStepperTemplate footer links default to the production environment. */
export const getMockFooterProps = (): FooterProps => {
  const getFooterLinkProps = (path: string): Partial<LinkProps> => ({
    href: `https://cdvnets.ractest.com.au/about-rac/site-info/${path}`,
  });
  return {
    variant: "sidebar",
    privacyLinkProps: getFooterLinkProps("privacy"),
    securityLinkProps: getFooterLinkProps("security"),
    disclaimerLinkProps: getFooterLinkProps("disclaimer"),
    accessibilityLinkProps: getFooterLinkProps("accessibility"),
  };
};
