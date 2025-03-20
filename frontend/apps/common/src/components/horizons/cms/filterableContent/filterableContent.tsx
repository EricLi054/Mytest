"use client";

import type { Tag } from "#types/common/contentfulTag";
import type { Article } from "#types/horizons/article";
import type { FilterableContentProps } from "#types/horizons/filterableContent";
import { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Chip, Container, Grid2, Stack, Typography } from "@mui/material";

import ArticleCard from "../../rendering/articleCard";
import ContentRelatedArticleRendering from "../../rendering/contentRelatedArticle";
import { styles } from "./styles";

const FilterableContentRendering = ({
  filterableContent,
  articles,
}: {
  filterableContent: FilterableContentProps;
  articles: Article[];
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(9);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagName) ? prevTags.filter((tag) => tag !== tagName) : [...prevTags, tagName],
    );
    setVisibleCount(9);
  };

  const filteredArticles = selectedTags.length
    ? articles.filter((article) => article.contentfulMetadata?.tags?.some((tag) => selectedTags.includes(tag.name)))
    : articles;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <Box component="section" sx={styles.filterableContentSection(filterableContent.sectionColour)}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Typography
            component="h2"
            variant="h2"
            sx={styles.filterableContentCategoryHeader(filterableContent.category)}
          >
            {filterableContent.heading}
          </Typography>
        </Box>
        {filterableContent.showTagFilters && (
          <Box display="flex" flexDirection="column" my={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <FilterListIcon />
              <Typography component="p" variant="body1" m={0}>
                Filters
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {filterableContent.contentfulMetadata.tags?.map((tag: Tag) => (
                <Chip
                  key={tag.name}
                  label={tag.name}
                  onClick={() => handleTagToggle(tag.name)}
                  clickable
                  sx={styles.filterableContentChip(selectedTags, tag.name)}
                  className="dynamic-article-tag-filter"
                />
              ))}
            </Stack>
          </Box>
        )}
        <Grid2 container spacing={4}>
          {filteredArticles.length > 0 ? (
            filteredArticles.slice(0, visibleCount).map((article: Article, index: number) => (
              <Grid2 key={index} size={{ xs: 12, md: 4 }}>
                <Box sx={styles.filterableContentArticleCardWrapper}>
                  <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <ContentRelatedArticleRendering
                      article={article}
                      showRelatedHeading={false}
                      showCategoryOnCard={filterableContent.showCategoryOnCard}
                    />
                  </Box>
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <ArticleCard
                      article={article}
                      showCategoryOnCard={filterableContent.showCategoryOnCard}
                      sectionColour={filterableContent.sectionColour}
                    />
                  </Box>
                </Box>
              </Grid2>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No articles match the selected filters.
            </Typography>
          )}
        </Grid2>
        {filteredArticles.length > 9 && visibleCount < filteredArticles.length && (
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLoadMore}
              sx={styles.filteredContentLoadMoreButton}
            >
              Load more
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FilterableContentRendering;
