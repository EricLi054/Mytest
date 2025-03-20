import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulPageHeader, PageHeaderProps } from "#types/horizons/pageHeader";
import NextLink from "next/link";
import { Box, Container, Grid2 as Grid, Link, Typography } from "@mui/material";
import { toKebabCase } from "#utils/common/toKebabCase";

import ContentfulRichTextRenderer from "../../rendering/contentfulRichTextRenderer";
import { getPageHeader } from "./data";
import { styles } from "./styles";

const fetchPageHeader = async (id: string) => {
  try {
    const data = await getPageHeader(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function PageHeader(props: ComponentProps) {
  const { data } = props;
  const pageHeaderContentfulEntry: ContentfulPageHeader = (await fetchPageHeader(data.sys.id)) as ContentfulPageHeader;

  if (!pageHeaderContentfulEntry) {
    return <></>;
  }

  const pageHeader: PageHeaderProps = pageHeaderContentfulEntry.data.horizons_pageHeader;

  return (
    <Box component="section" sx={styles.pageHeaderSection(pageHeader.sectionColour)}>
      <Container maxWidth="lg">
        {pageHeader.parentBreadcrumb && (
          <Link component={NextLink} href={`/horizons/${toKebabCase(pageHeader.parentBreadcrumb)}`} underline="none">
            <Typography component="p" variant="overline" m={0}>
              {pageHeader.parentBreadcrumb}
            </Typography>
          </Link>
        )}
        <Typography component="h1" variant="display2" mt={0}>
          {pageHeader.title}
        </Typography>
        <Grid container spacing={{ xs: 4, md: 0 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <ContentfulRichTextRenderer text={pageHeader.leftContent} typographyVariant="subtitle1" />
          </Grid>
          <Grid size={{ xs: 12, md: 1 }}></Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ContentfulRichTextRenderer text={pageHeader.rightContent} typographyVariant="subtitle1" />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PageHeader;
