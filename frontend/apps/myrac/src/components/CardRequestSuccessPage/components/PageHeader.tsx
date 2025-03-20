import type { JSX } from "react";
import React from "react";
import { Grid2 as Grid } from "@mui/material";

import { HeaderIconWrapper, HeadingSection, IconSection } from "./PageHeader.styled";

export type PageHeaderProps = {
  HeaderIcon: () => JSX.Element;
  HeaderText: () => JSX.Element;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ HeaderIcon, HeaderText }) => {
  return (
    <Grid textAlign="center" direction="column">
      {/* Header Icon  */}
      <IconSection container>
        <HeaderIconWrapper>
          <HeaderIcon />
        </HeaderIconWrapper>
      </IconSection>
      {/* Heading and Sub-Heading  */}
      <HeadingSection container>
        <HeaderText />
      </HeadingSection>
    </Grid>
  );
};
