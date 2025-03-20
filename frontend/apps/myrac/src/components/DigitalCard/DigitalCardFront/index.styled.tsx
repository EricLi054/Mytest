"use client";

import type { Breakpoint } from "@mui/material";
import { Box, styled, Typography } from "@mui/material";

import { colors } from "@racwa/styles";

import RacwaLogo from "./RacLogo";

const mobileBreakpoint: Breakpoint = "sm";

export const StyledCardContainer = styled(Box)(({ theme }) => ({
  aspectRatio: 86 / 54,
  borderRadius: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: "256px",
  },
}));

export const StyledCardFront = styled(StyledCardContainer)(({ theme }) => ({
  backgroundColor: colors.racYellow,
  position: "relative",
  flexDirection: "column",
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 16px 24px 16px",
  border: "solid 1px rgba(185, 152, 0, 0.4)",
  boxShadow: "1px 2px 4px 0px rgba(0, 0, 0, 0.15)",
  [theme.breakpoints.up(mobileBreakpoint)]: {
    padding: "16px 16px 16px 16px",
  },
}));

export const StyledRACBadge = styled(RacwaLogo)(({ theme }) => ({
  fontSize: "2.8rem",
  [theme.breakpoints.up(mobileBreakpoint)]: {
    fontSize: "2rem",
  },
}));

export const StyledCardDetailsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  textAlign: "left",
  gap: "16px",
  [theme.breakpoints.up(mobileBreakpoint)]: {
    gap: "12px",
  },
}));

export const StyledMemberDisplayName = styled(Typography)(() => ({
  fontWeight: "400",
  textTransform: "uppercase",
  fontSize: "16px",
  textAlign: "left",
}));

export const StyledDetailsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: "16px",
  [theme.breakpoints.up(mobileBreakpoint)]: {
    gap: "42px",
  },
}));

export const StyledDetailsText = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  [theme.breakpoints.up(mobileBreakpoint)]: {
    display: "flex",
    flexDirection: "column",
  },
}));
