"use client";

import type { PropsWithChildren } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";

import { colors } from "@racwa/styles";

import { StyledChildrenContainer, StyledRacwaStandardPageTemplate } from "./styled";

export type GenericErrorComponentProps = {
  heading?: string;
  subHeading?: string;
} & PropsWithChildren;

export const GenericErrorComponent: React.FC<GenericErrorComponentProps> = ({
  children,
  heading = "Uh oh!",
  subHeading = "Something went wrong",
}) => {
  return (
    <div style={{ height: "100dvh" }}>
      <StyledRacwaStandardPageTemplate heading={heading} breakpoint="md">
        <Grid container justifyContent="center" alignItems="center" direction="column" bgcolor="white">
          <Grid textAlign={{ xs: "unset", md: "center" }} width="100%" maxWidth={520}>
            <Typography variant="h2" color={colors.dieselDeep} sx={{ mb: 2 }}>
              {subHeading}
            </Typography>
            <StyledChildrenContainer>{children}</StyledChildrenContainer>
          </Grid>
        </Grid>
      </StyledRacwaStandardPageTemplate>
    </div>
  );
};
