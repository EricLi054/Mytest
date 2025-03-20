import type { LinkProps } from "@mui/material";
import { EMPTY_URL } from "#constants";
import { clientEnv } from "#env/client";

import type { FooterProps } from "@racwa/react-components";

export const getFooterProps = (): FooterProps => {
  const getLinkProps = (link?: string): Partial<LinkProps> => ({
    href: link ?? EMPTY_URL,
  });

  return {
    variant: "sidebar",
    privacyLinkProps: getLinkProps(clientEnv().NEXT_PUBLIC_RAC_ABOUT_PRIVACY_URL),
    securityLinkProps: getLinkProps(clientEnv().NEXT_PUBLIC_RAC_ABOUT_SECURITY_URL),
    disclaimerLinkProps: getLinkProps(clientEnv().NEXT_PUBLIC_RAC_ABOUT_DISCLAIMER_URL),
    accessibilityLinkProps: getLinkProps(clientEnv().NEXT_PUBLIC_RAC_ABOUT_ACCESSIBILITY_URL),
  };
};
