"use client";

import type { Article } from "#types/horizons/article";
import type { Category } from "#types/horizons/category";
import NextLink from "next/link";
import { Box, Button, Container, Grid2, Typography } from "@mui/material";
import { useIsMobile } from "#hooks/common/useIsMobile";
import { useIsTablet } from "#hooks/common/useIsTablet";

import ArticleCard from "../../rendering/articleCard";
import ArticleWithRichMediaCard from "../../rendering/articleWithRichMediaCard";
import SimpleArticleListItemRendering from "../../rendering/simpleArticleListItem";
import { styles } from "./styles";

type ArticleGridWithListProps = {
  category: Category;
  heading: string;
  articles: Article[];
  cardType: "" | "Article" | "Article with Rich Media";
  seeMoreButtonText: string;
  seeMoreButtonUrl: string;
  showCategoryOnCard: boolean;
  sectionColour: "White" | "Grey";
};

const ArticleGridWithList = ({
  category,
  heading,
  articles,
  cardType,
  seeMoreButtonText,
  seeMoreButtonUrl,
  showCategoryOnCard,
  sectionColour,
}: ArticleGridWithListProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const firstArticles = isMobile || isTablet ? articles.slice(0, 1) : articles.slice(0, 2);
  const remainingArticles = articles.slice(isMobile || isTablet ? 1 : 2);

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Typography variant="h2" component="h2" sx={styles.gridWithListCategoryHeader(category)}>
          {heading}
        </Typography>
      </Box>
      <Grid2 container spacing={6}>
        {firstArticles.map((article: Article, index: number) => (
          <Grid2 size={{ xs: 12, sm: 12, md: 4 }} key={index} height={{ xs: "360px", sm: "400px", md: "444px" }}>
            {(() => {
              switch (cardType) {
                case "Article":
                  return (
                    <ArticleCard
                      article={article}
                      showCategoryOnCard={showCategoryOnCard}
                      sectionColour={sectionColour}
                    />
                  );
                case "Article with Rich Media":
                  return <ArticleWithRichMediaCard article={article} showCategoryOnCard={showCategoryOnCard} />;
                default:
                  return (
                    <ArticleCard
                      article={article}
                      showCategoryOnCard={showCategoryOnCard}
                      sectionColour={sectionColour}
                    />
                  );
              }
            })()}
          </Grid2>
        ))}
        <Grid2 size={{ xs: 12, sm: 12, md: 4 }}>
          {remainingArticles.map((article: Article, index: number) => (
            <SimpleArticleListItemRendering key={index} article={article} showCategoryOnCard={showCategoryOnCard} />
          ))}
          <Button
            LinkComponent={NextLink}
            variant="outlined"
            color="primary"
            size="medium"
            href={seeMoreButtonUrl}
            role="button"
            sx={styles.seeMoreButton}
            className="btn-white-cta"
          >
            {seeMoreButtonText}
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ArticleGridWithList;
