"use client";

import type { ReactNode } from "react";
import { Box, Card, Grid2 } from "@mui/material";

import { CardContainer } from "@racwa/react-components";

import { styles } from "./styles";

type WebsiteBannerProps = {
  bannerImage: string;
  bannerText: ReactNode;
};

function WebsiteBanner({ bannerImage, bannerText }: WebsiteBannerProps) {
  return (
    <Box sx={styles.backgroundImageDiv(bannerImage)} data-testid="background">
      <CardContainer>
        <Card sx={styles.styledCard}>
          <Grid2 container sx={styles.styledGrid}>
            {bannerText}
          </Grid2>
        </Card>
      </CardContainer>
    </Box>
  );
}

export default WebsiteBanner;
