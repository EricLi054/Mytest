"use client";

import type { LinkProps } from "@mui/material";
import { Link, styled } from "@mui/material";

import { colors } from "@racwa/styles";

/**
 * TODO - DED-1295 - Use the styled component in the UI package? Is it a good idea to make this package dependent on the UI package?
 */
export const StyledLink: React.ComponentType<LinkProps> = styled(Link)(() => ({
  color: colors.linkBlue,
  cursor: "pointer",
}));
