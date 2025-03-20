"use client";

import { Grid2 as Grid, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  backgroundColor: colors.white,
  [theme.breakpoints.up("sm")]: {
    padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
  },
}));
