"use client";

import type { LinkProps } from "@mui/material";
import { Link, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const StyledLink: React.ComponentType<LinkProps> = styled(Link)(() => ({
  color: colors.linkBlue,
  cursor: "pointer",
}));
