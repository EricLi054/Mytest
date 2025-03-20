"use client";

import type { LinkListProps } from "#types/horizons/linkList";
import type { Page } from "#types/horizons/page";
import { useState } from "react";
import NextLink from "next/link";
import { Box, Button, Container, Grid2, Link, Typography } from "@mui/material";

import { CldImage } from "@racwa/ui";

import { styles } from "./styles";

type LinkListRenderingProps = {
  linkList: LinkListProps;
  pages: Page[];
};

const LinkListRendering = ({ linkList, pages }: LinkListRenderingProps) => {
  const [showAll, setShowAll] = useState(false);

  const handleViewMore = () => setShowAll(true);

  const displayedTopics = showAll ? pages : pages.slice(0, 4);

  return (
    <Container maxWidth="lg">
      <Box sx={styles.headerBox}>
        <Typography component="h2" variant="h2" sx={styles.linkListCategoryHeader(linkList.category)}>
          {linkList.heading}
        </Typography>
      </Box>
      <Grid2 container spacing={3} justifyContent="center" sx={styles.gridContainer}>
        {displayedTopics.map((topic) => (
          <Grid2 key={topic.slug} size={{ xs: 6, sm: 3, md: 3 }} sx={styles.topicGridItem}>
            <Link
              component={NextLink}
              href={`/horizons/${topic.slug}`}
              underline="none"
              role="link"
              sx={styles.topicLink}
            >
              <Box sx={styles.topicImageWrapper}>
                <Box
                  component={CldImage}
                  environmentPath="/rac-horizons"
                  src={topic.seoMetaTags?.openGraphImage?.image[0]?.secure_url ?? ""}
                  alt={
                    topic.seoMetaTags?.openGraphImage?.image_data?.[0]?.context?.custom?.alt ??
                    topic.seoMetaTags?.openGraphImage?.image[0]?.context?.custom?.alt ??
                    ""
                  }
                  title={topic.title ?? ""}
                  sx={styles.topicImage}
                  fill={true}
                  sizes="100%"
                  quality="auto:low"
                />
              </Box>
              <Box>
                <Typography component="p" variant="body1" sx={styles.topicDescriptionBox} noWrap>
                  {topic.title}
                </Typography>
              </Box>
            </Link>
          </Grid2>
        ))}
      </Grid2>
      {!showAll && pages.length > 4 && (
        <Box sx={styles.viewMoreButtonBox}>
          <Button variant="outlined" size="medium" onClick={handleViewMore} role="button">
            View more
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default LinkListRendering;
