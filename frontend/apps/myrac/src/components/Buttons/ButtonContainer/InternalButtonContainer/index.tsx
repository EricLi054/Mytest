"use client";

import type { Breakpoint } from "@mui/material";
import type { PropsWithChildren } from "react";
import React from "react";
import { Grid2 as Grid } from "@mui/material";

import { StyledButtonContainer } from "./styled";

type InternalButtonContainerProps = {
  stackTogether: boolean;
  itemsPerRow: number;
  largeWidth: number;
  columnBreakpoint: Breakpoint;
  gap: number;
} & PropsWithChildren;

export default function InternalButtonContainer({
  stackTogether,
  itemsPerRow,
  largeWidth,
  columnBreakpoint,
  gap,
  children,
}: InternalButtonContainerProps) {
  return (
    <StyledButtonContainer
      container
      spacing={gap}
      maxWidth={largeWidth * 8}
      direction={{ xs: "column", [columnBreakpoint]: "row" }}
      stackTogether={stackTogether}
      columnBreakpoint={columnBreakpoint}
    >
      {React.Children.map(children, (child, index) => {
        return (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: columnBreakpoint === "sm" ? 12 / itemsPerRow : undefined,
              md: columnBreakpoint === "md" ? 12 / itemsPerRow : undefined,
            }}
          >
            {child}
          </Grid>
        );
      })}
    </StyledButtonContainer>
  );
}
