'use client';

import { logEvent } from '@/utilities/analyticsTagging';
import { StyledLink, type StyledLinkProps } from '../StyledComponents/Link.styled';
import { type HTMLAttributeAnchorTarget } from 'react';
import { type LinkProps as MUILinkProps } from '@mui/material';
import { type LinkProps } from '@/types/cmsTypes/LinkProps';

interface GALinkProps extends StyledLinkProps, Partial<LinkProps> {
  target?: HTMLAttributeAnchorTarget;
}

export const GALink = ({
  longLinkText,
  linkUrl,
  href,
  googleAnalyticsDescription,
  target,
  children,
  ...props
}: GALinkProps & MUILinkProps) => {
  return (
    <StyledLink
      href={linkUrl ?? href}
      {...props}
      onClick={() => {
        if (googleAnalyticsDescription) logEvent(googleAnalyticsDescription);
      }}
      target={target}
    >
      {longLinkText}
      {children}
    </StyledLink>
  );
};
