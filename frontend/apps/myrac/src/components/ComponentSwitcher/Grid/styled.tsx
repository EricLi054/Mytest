"use client";

import { Grid2 as Grid, styled } from "@mui/material";

import { colors } from "@racwa/styles";

const getColourByKey = (key: string | undefined) => {
  const entry = Object.entries(colors).find(([k]) => k === key);
  if (entry) {
    return entry[1] as string;
  }

  return undefined;
};

const StyledGrid = styled(Grid, { shouldForwardProp: (prop) => prop !== "backgroundColor" })<{
  backgroundColor?: string;
}>(({ backgroundColor }) => ({
  backgroundColor: getColourByKey(backgroundColor),
}));

export default StyledGrid;
