import type { JSX } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";

import { IconWrapper, TextCardContainer, TextCardTitle } from "./PageTextCard.styled";

export type PageTextCardProps = {
  Icon?: () => JSX.Element;
  Title: () => JSX.Element;
  Content: () => JSX.Element;
};
export const PageTextCard: React.FC<PageTextCardProps> = ({ Icon, Title, Content }) => {
  return (
    <TextCardContainer container googleAnalyticsDescription="Member Central - Digital pass inactive">
      <TextCardTitle container>
        {Icon && (
          <IconWrapper>
            <Icon />
          </IconWrapper>
        )}

        <Typography variant="h3">
          <Title />
        </Typography>
      </TextCardTitle>

      <Grid>
        <Content />
      </Grid>
    </TextCardContainer>
  );
};
