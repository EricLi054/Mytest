"use client";

import type { Theme } from "@mui/material";
import { useMemo } from "react";
import { Grid2 as Grid, Skeleton, styled } from "@mui/material";

import { Card, theme } from "@racwa/react-components";
import { colors } from "@racwa/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: 0,
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  backgroundColor: colors.white,
  color: theme.palette.secondary.light,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    maxWidth: theme.spacing(120),
    padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
  },
}));

const StyledSkeleton = styled(Skeleton)(() => ({
  transform: "unset",
}));

const StyledIconSkeleton = styled(StyledSkeleton)(({ theme }) => ({
  width: theme.spacing(9),
  height: theme.spacing(6.5),
}));

const StyledTitleSkeleton = styled(StyledSkeleton)(({ theme }) => ({
  width: theme.spacing(22),
  height: theme.spacing(2.5),
}));

const StyledSubTitleSkeleton = styled(StyledSkeleton)(({ theme }) => ({
  width: theme.spacing(23),
  height: theme.spacing(1.5),
}));

const StyledSubTitleSecondarySkeleton = styled(StyledSkeleton)(({ theme }) => ({
  width: theme.spacing(22),
  height: theme.spacing(1),
}));

const StyledActionButtonSkeleton = styled(StyledSkeleton)(({ theme }) => ({
  width: "100%",
  height: theme.spacing(6),
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(23.5),
  },
}));

const StyledPolicyDataSkeleton = styled(StyledSkeleton)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(1.5),
}));

export default function ProductCardSkeleton() {
  const productHeader = useMemo(() => {
    return (
      <Grid
        data-testid="product-card-skeleton-header"
        container
        direction="column"
        gap={2}
        width={{ xs: "auto", md: "100%" }}
      >
        <StyledTitleSkeleton />
        <StyledSubTitleSkeleton />
        <StyledSubTitleSecondarySkeleton />
      </Grid>
    );
  }, []);

  const actions = useMemo(() => {
    return (
      <Grid data-testid="product-card-skeleton-actions" container gap={2}>
        <StyledActionButtonSkeleton />
        <StyledActionButtonSkeleton />
      </Grid>
    );
  }, []);

  const details = useMemo(() => {
    return (
      <Grid
        data-testid="product-card-skeleton-details"
        container
        direction={{ xs: "column", md: "row" }}
        rowSpacing={2.5}
        columnSpacing={3}
      >
        <Grid container direction="column" size={{ xs: 6 }} rowSpacing={2.5} columnSpacing={3}>
          <Grid container direction="column" gap={1.5}>
            <StyledPolicyDataSkeleton />
            <StyledPolicyDataSkeleton />
          </Grid>
          <Grid container direction="column" gap={1.5}>
            <StyledPolicyDataSkeleton width={(theme as Theme).spacing(8)} />
            <StyledPolicyDataSkeleton width={(theme as Theme).spacing(15)} />
          </Grid>
        </Grid>
        <Grid container direction="column" size={{ xs: 6 }} rowSpacing={2.5} columnSpacing={3}>
          <Grid container direction="column" gap={1.5}>
            <StyledPolicyDataSkeleton />
            <StyledPolicyDataSkeleton width={(theme as Theme).spacing(15)} />
          </Grid>
        </Grid>
      </Grid>
    );
  }, []);

  return (
    <>
      <StyledCard border sx={{ display: { xs: "block", md: "none" } }}>
        <Grid container direction="column" gap={3}>
          <Grid container direction="row" justifyContent={"space-between"}>
            {productHeader}
            <StyledIconSkeleton />
          </Grid>
          {details}
          {actions}
        </Grid>
      </StyledCard>
      <StyledCard border sx={{ display: { xs: "none", md: "block" } }}>
        <Grid container direction={"row"} width={"100%"} alignItems={"flex-start"} gap={3} flexWrap={"nowrap"}>
          <StyledIconSkeleton />
          <Grid container flexGrow={1} direction="column" rowGap={3} width="auto">
            <Grid container direction="row" gap={3} flexWrap={"nowrap"}>
              {productHeader}
              {actions}
            </Grid>
            {details}
          </Grid>
        </Grid>
      </StyledCard>
    </>
  );
}
