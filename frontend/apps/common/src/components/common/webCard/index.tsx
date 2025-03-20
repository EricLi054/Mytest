"use client";

import type { WebCardDetails } from "#types/common/webCardWrapper";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Phone from "@mui/icons-material/Phone";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

import { CldImage } from "@racwa/ui";

import ContentfulRichTextRenderer from "../contentfulRichTextRenderer";
import { styles } from "./styles";

type WebCardProps = {
  webCardDetails: WebCardDetails;
};

const WebCard = ({ webCardDetails }: WebCardProps) => {
  return (
    <Card sx={styles.cardHeadingBox}>
      <CardContent sx={styles.cardContent}>
        {webCardDetails.showRibbon && (
          <Box sx={styles.containerCorner}>
            <Box sx={styles.cornerRibbon}>{webCardDetails.ribbonText}</Box>
          </Box>
        )}
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

          <Typography variant="h2" sx={styles.cardHeading} gutterBottom>
            {webCardDetails.title}
          </Typography>
        </Box>
        <Box sx={styles.cardText}>
          <ContentfulRichTextRenderer text={webCardDetails.content} typographyVariant="body1" />
        </Box>
        <Box>
          {webCardDetails.extraInfoHeader != null && (
            <Accordion>
              <AccordionSummary
                sx={styles.additionalInfoText}
                expandIcon={<ArrowDropDown />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {webCardDetails.extraInfoHeader}
              </AccordionSummary>
              <AccordionDetails>
                <ContentfulRichTextRenderer text={webCardDetails.extraInfo} typographyVariant="body2" />
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </CardContent>
      <CardActions sx={styles.contactButton} disableSpacing>
        {webCardDetails.buttonText != null && webCardDetails.buttonLink != null && (
          <Button href={webCardDetails.buttonLink} fullWidth color="primary">
            {webCardDetails.buttonText}
          </Button>
        )}
        {webCardDetails.buttonText != null && webCardDetails.buttonLink == null && (
          <Button
            href={`tel:${webCardDetails.buttonText.replaceAll(" ", "")}`}
            fullWidth
            color="primary"
            startIcon={<Phone />}
          >
            {webCardDetails.buttonText}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
export default WebCard;
