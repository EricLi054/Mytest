"use client";

import type { PropsWithChildren } from "react";
import { Box, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export function RootContainer({ children }: PropsWithChildren) {
  return <StyledBox>{children}</StyledBox>;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: colors.subtleBg,
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  width: "100%",
  maxWidth: "560px",
  margin: "60px 60px 40px 60px",
  padding: "32px 16px",

  [theme.breakpoints.down("sm")]: {
    margin: "0",
    width: "100vw",
  },
}));
