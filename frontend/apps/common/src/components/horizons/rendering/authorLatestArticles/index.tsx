import type { Article } from "#types/horizons/article";
import { Box, Typography } from "@mui/material";
import FilterableContentRendering from "#components/horizons/cms/filterableContent/filterableContent";
import ContentRelatedArticleRendering from "#components/horizons/rendering/contentRelatedArticle";

import { styles } from "./styles";

type AuthorLatestArticlesProps = {
  articles: Article[];
};

const AuthorLatestArticles = ({ articles }: AuthorLatestArticlesProps) => {
  return (
    <>
      {articles.length > 0 && (
        <>
          <Box
            component="section"
            data-testid="author-latest-articles-desktop"
            sx={styles.authorLatestArticlesWrapperDesktop}
          >
            <FilterableContentRendering
              filterableContent={{
                title: "Author Dynamic Article List",
                slug: "author-dynamic-article-list",
                sectionColour: "White",
                category: {
                  name: "Author",
                  slug: "author",
                  colour: "Navy",
                },
                heading: "Latest",
                filterBy: "Category",
                showTagFilters: false,
                showCategoryOnCard: true,
                contentfulMetadata: {
                  tags: null,
                },
              }}
              articles={articles}
            />
          </Box>
          <Box data-testid="author-latest-articles-mobile" sx={styles.authorLatestArticlesWrapperMobile}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h2" component="h2" sx={styles.authorLatestArticlesMobileHeader}>
                Latest
              </Typography>
            </Box>
            {articles.map((article: Article, index: number) => (
              <ContentRelatedArticleRendering
                data-testid="content-related-article-rendering"
                key={index}
                article={article}
                showRelatedHeading={false}
                showCategoryOnCard={true}
              />
            ))}
          </Box>
        </>
      )}
      {articles.length === 0 && (
        <Box component="section" sx={{ py: 5 }}>
          <Typography variant="body1" component="p" align="center">
            This author has no articles yet.
          </Typography>
        </Box>
      )}
    </>
  );
};
export default AuthorLatestArticles;
