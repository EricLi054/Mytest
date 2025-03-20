"use client";

import type { Grid2Props as GridProps } from "@mui/material";
import { useEffect } from "react";
import { Grid2 as Grid, styled } from "@mui/material";
import { logEvent } from "#utils/analyticsTagging";

import { colors } from "@racwa/styles";

type EventOnDisplayGridProps = {
  googleAnalyticsDescription: string;
} & GridProps;

const EventOnDisplayGrid = ({ googleAnalyticsDescription, children, ...props }: EventOnDisplayGridProps) => {
  useEffect(() => {
    logEvent(googleAnalyticsDescription);
  }, [googleAnalyticsDescription]);

  return <Grid {...props}>{children}</Grid>;
};

export const TextCardContainer = styled(EventOnDisplayGrid)(({ theme }) => ({
  padding: theme.spacing(3),
  flexDirection: "column",
  textAlign: "left",
  gap: theme.spacing(1),
  backgroundColor: colors.white,
  borderRadius: "4px",
}));

export const TextCardTitle = styled(Grid)(({ theme }) => ({
  flexDirection: "row",
  gap: theme.spacing(0.5),
  alignItems: "center",
}));

export const IconWrapper = styled(Grid)(() => ({
  width: "20px",
  color: colors.dieselDeep,
  display: "flex",
  fontSize: "18px",
}));
