"use client";

import type { LinkProps as MUILinkProps } from "@mui/material";
import type { HTMLAttributeAnchorTarget } from "react";
import type { z } from "zod";
import { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import { logEvent } from "#utils/analyticsTagging";

import type { StyledNextLinkProps } from "../StyledNextLink";
import { StyledNextLink } from "../StyledNextLink";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PartialContentfulLinkSchema = ContentfulLinkSchema.partial();

type GALinkProps = {
  target?: HTMLAttributeAnchorTarget;
} & StyledNextLinkProps &
  z.infer<typeof PartialContentfulLinkSchema>;

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
    <StyledNextLink
      href={linkUrl ?? href}
      {...props}
      onClick={() => {
        if (googleAnalyticsDescription) {
          logEvent(googleAnalyticsDescription);
        }
      }}
      target={target}
    >
      {longLinkText}
      {children}
    </StyledNextLink>
  );
};
