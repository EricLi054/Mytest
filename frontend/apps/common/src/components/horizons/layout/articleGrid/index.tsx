import type { Article } from "#types/horizons/article";
import type { Category } from "#types/horizons/category";
import { Box, Container, Grid2, Typography } from "@mui/material";

import ArticleCard from "../../rendering/articleCard";
import ArticleWithRichMediaCard from "../../rendering/articleWithRichMediaCard";
import { styles } from "./styles";

type ArticleGridProps = {
  category: Category;
  heading: string;
  articles: Article[];
  cardType: "" | "Article" | "Article with Rich Media";
  showCategoryOnCard: boolean;
  sectionColour: "White" | "Grey";
};

const ArticleGrid = ({
  category,
  heading,
  articles,
  cardType,
  showCategoryOnCard,
  sectionColour,
}: ArticleGridProps) => {
  return (
    <Container maxWidth="lg" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Typography variant="h2" component="h2" sx={styles.gridCategoryHeader(category)}>
          {heading}
        </Typography>
      </Box>
      <Grid2 container spacing={4}>
        {articles.map((article: Article, index: number) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index} height={cardType === "Article" ? "468px" : "auto"}>
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
  );
};

export default ArticleGrid;
