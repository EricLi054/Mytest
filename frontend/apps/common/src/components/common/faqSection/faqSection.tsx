"use client";

import type { RichTextProps } from "#types/common/richTextProps";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ContentfulRichTextRenderer from "../contentfulRichTextRenderer";
import { styles } from "./styles";

type FaqProps = {
  faqs: RichTextProps;
};

function ContactUsFAQ({ faqs }: FaqProps) {
  return (
    <Grid container spacing={3} direction="row">
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h1" component="h1" sx={styles.faqHeader}>
              Frequently Asked Questions
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }} sx={styles.faqGridQuestions}>
        <Grid container spacing={3} direction="row">
          <Grid size={{ xs: 12, md: 12 }}>
            <Box>
              <ContentfulRichTextRenderer text={faqs} typographyVariant="subtitle2" />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ContactUsFAQ;
