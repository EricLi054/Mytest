import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulTypography, TypographyProps } from "#types/horizons/typography";
import { Box, Container, Grid2, Typography as MuiTypography } from "@mui/material";

import ContentfulRichTextRenderer from "../../rendering/contentfulRichTextRenderer";
import { getTypography } from "./data";

const fetchTypography = async (id: string) => {
  try {
    const data = await getTypography(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function Typography(props: ComponentProps) {
  const { data } = props;
  const typographyContentfulEntry: ContentfulTypography = (await fetchTypography(data.sys.id)) as ContentfulTypography;

  if (!typographyContentfulEntry) {
    return <></>;
  }

  const typography: TypographyProps = typographyContentfulEntry.data.horizons_typography;

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <MuiTypography variant="h2" component="h2" mb={4}>
          {typography.heading}
        </MuiTypography>
        {typography.layoutSize === "Full width" ? (
          <Grid2 container>
            <Grid2 size={12}>
              <ContentfulRichTextRenderer text={typography.leftContent} relatedArticleVariant="simple" />
            </Grid2>
          </Grid2>
        ) : (
          <Grid2 container>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <ContentfulRichTextRenderer text={typography.leftContent} relatedArticleVariant="simple" />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 8 }}>
              <ContentfulRichTextRenderer text={typography.rightContent} relatedArticleVariant="simple" />
            </Grid2>
          </Grid2>
        )}
      </Container>
    </Box>
  );
}

export default Typography;
