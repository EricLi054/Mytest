"use client";

import { Box, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const StyledBox = styled(Box)(() => ({
  display: "flex",
  textAlign: "center",
  padding: "8px 16px",
  alignItems: "center",
  width: "fit-content",
  height: "32px",
  borderRadius: "16px",
  borderColor: colors.racGray,
}));
