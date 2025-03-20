"use client";

import { Grid2 as Grid, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const HeaderIconWrapper = styled(Grid)(() => ({
  color: colors.dieselDeeper,
  "& svg": {
    fontSize: "48px",
  },
}));

export const HeadingSection = styled(Grid)(({ theme }) => ({
  width: "100%",
  flexDirection: "column",
  gap: theme.spacing(2),
  color: colors.dieselDeeper,
  paddingBottom: theme.spacing(3),
}));

export const IconSection = styled(Grid)(({ theme }) => ({
  flexDirection: "column",
  paddingBottom: theme.spacing(3),
  gap: theme.spacing(3),
}));

// Heading section used in Membership and Profile page with back link
export const HeadingWithLinkSection = styled(Grid)(({ theme }) => ({
  width: "100%",
  flexDirection: "column",
  gap: theme.spacing(1),
  color: colors.dieselDeeper,
}));

export const PageContainerGrid = styled(Grid)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(8),
  backgroundColor: colors.subtleBg,
  padding: "2.5rem 1rem 5rem 1rem",
  [theme.breakpoints.up("sm")]: {
    padding: "6.5rem 1rem 8rem 1rem",
  },
}));

export const PageContentGrid = styled(Grid)(() => ({
  flexDirection: "column",
  textAlign: "center",
}));
