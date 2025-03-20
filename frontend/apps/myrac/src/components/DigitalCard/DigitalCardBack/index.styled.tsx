"use client";

import { Box, styled, Typography } from "@mui/material";

import { colors } from "@racwa/styles";

import { StyledCardContainer } from "../DigitalCardFront/index.styled";

export const StyledCardBack = styled(StyledCardContainer)(({ theme }) => ({
  backgroundColor: colors.dieselDeepest,
  gap: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  padding: 0,
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "1px 2px 4px 0px rgba(0, 0, 0, 0.15)",
}));

export const StyledCardHeading = styled(Typography)(() => ({
  color: colors.white,
  textAlign: "center",
  fontSize: "26px",
  fontWeight: 600,
  lineHeight: "30px",
}));

export const StyledCardContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  alignItems: "center",
  width: "100%",
  color: "white",
}));

export const StyledBarcodeWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  width: "90%",
  backgroundColor: colors.white,
  borderRadius: "8px",
  padding: theme.spacing(1),
}));
