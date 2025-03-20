"use client";

import type { LinkProps as MUILinkProps } from "@mui/material";
import type { LinkProps as NextLinkProps } from "next/link";
import Link from "next/link";
import { styled } from "@mui/material";

import { colors } from "@racwa/styles";

const InternalStyledNextLink = styled(Link)(({ theme }) => ({
  ...(theme.components?.MuiLink?.styleOverrides?.root as object),
  color: colors.linkBlue,
  cursor: "pointer",
  outline: "none",
}));

export type StyledNextLinkProps = Pick<NextLinkProps, "href"> & Omit<MUILinkProps, "color" | "href">;

export const StyledNextLink = ({ children, ...props }: StyledNextLinkProps) => {
  return <InternalStyledNextLink {...props}>{children}</InternalStyledNextLink>;
};
