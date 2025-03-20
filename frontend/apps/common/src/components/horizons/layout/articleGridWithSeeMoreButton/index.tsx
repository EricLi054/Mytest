"use client";

import type { Article } from "#types/horizons/article";
import type { Category } from "#types/horizons/category";
import NextLink from "next/link";
import { Box, Button, Container, Grid2, Typography } from "@mui/material";

import ArticleCard from "../../rendering/articleCard";
import ArticleWithRichMediaCard from "../../rendering/articleWithRichMediaCard";
import { styles } from "./styles";

type ArticleGridWithSeeMoreButtonProps = {
  category: Category;
  heading: string;
  articles: Article[];
  cardType: "" | "Article" | "Article with Rich Media";
  seeMoreButtonText: string;
  seeMoreButtonUrl: string;
  showCategoryOnCard: boolean;
  sectionColour: "White" | "Grey";
};

const ArticleGridWithSeeMoreButton = ({
  heading,
  category,
  articles,
  cardType,
  seeMoreButtonText,
  seeMoreButtonUrl,
  showCategoryOnCard,
  sectionColour,
}: ArticleGridWithSeeMoreButtonProps) => {
  return (
    <>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Typography variant="h2" component="h2" sx={styles.gridWithSeeMoreButtonCategoryHeader(category)}>
            {heading}
          </Typography>
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
        </Box>
        <Grid2 container spacing={3}>
          {articles.map((article: Article, index: number) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
        </Grid2>
      </Container>
    </>
  );
};

export default ArticleGridWithSeeMoreButton;
