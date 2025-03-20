"use client";

import type { WebCardDetails } from "#types/common/webCardWrapper";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { CldImage } from "@racwa/ui";

import ContentfulRichTextRenderer from "../contentfulRichTextRenderer";
import { styles } from "./styles";

type WebCardFullProps = {
  webCardDetails: WebCardDetails;
};

const WebCardFull = ({ webCardDetails }: WebCardFullProps) => {
  return (
    <Grid size={{ xs: 12 }} sx={styles.cardFullBox}>
      <Grid container spacing={3} direction="row">
        <Grid size={{ xs: 12, md: 1 }} sx={styles.cardAlign}>
          <Box sx={styles.cardImage}>
            {webCardDetails.image.length != 0 && webCardDetails.image[0] != undefined && (
              <CldImage
                src={webCardDetails.image[0].secure_url}
                alt=""
                style={{ borderRadius: 3 }}
                width={webCardDetails.image[0].width}
                height={webCardDetails.image[0].height}
                data-testid="web-card-icon"
              />
            )}
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Typography variant="h2" sx={styles.cardHeading} gutterBottom>
            {webCardDetails.title}
          </Typography>
          <Box sx={styles.cardText}>
            <ContentfulRichTextRenderer text={webCardDetails.content} typographyVariant="body1" />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }} sx={styles.cardAlign}>
          {webCardDetails.buttonText != null && webCardDetails.buttonLink != null && (
            <Box sx={styles.contactButton}>
              <Button href={webCardDetails.buttonLink}>{webCardDetails.buttonText}</Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default WebCardFull;
