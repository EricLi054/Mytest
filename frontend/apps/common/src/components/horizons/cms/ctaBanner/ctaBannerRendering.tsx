import type { ctaBannerProps } from "#types/horizons/ctaBanner";
import NextLink from "next/link";
import { Box, Button, Container, Link, Typography } from "@mui/material";
import { optimiseCloudinaryImage } from "#utils/horizons/optimiseCloudinaryImage";

import { styles } from "./styles";

type CtaBannerRenderingProps = {
  ctaBanner: ctaBannerProps;
};

const CtaBannerRendering = ({ ctaBanner }: CtaBannerRenderingProps) => {
  return (
    <Box
      component="section"
      sx={styles.ctaBannerSection(optimiseCloudinaryImage(ctaBanner.image.image[0]?.secure_url ?? ""))}
    >
      <Container maxWidth="lg" sx={styles.ctaBannerContainer(ctaBanner.contentPosition)}>
        <Box sx={styles.ctaBannerOverlay(ctaBanner.contentPosition)}>
          <Box px={3}>
            <Link component={NextLink} href={`/horizons/${ctaBanner.category.slug}`} color="inherit" underline="none">
              <Typography component="p" variant="overline">
                {ctaBanner.category.name}
              </Typography>
            </Link>
            <Typography variant="display3" component="h2" mb={3} mt={0}>
              {ctaBanner.heading}
            </Typography>
            <Typography variant="body1" mb={3} mt={0}>
              {ctaBanner.subtext}
            </Typography>
            <Button
              LinkComponent={NextLink}
              variant="outlined"
              color="inherit"
              href={ctaBanner.buttonUrl}
              sx={styles.ctaBannerButton}
              className="btn-promo-cta"
            >
              {ctaBanner.buttonText}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CtaBannerRendering;
