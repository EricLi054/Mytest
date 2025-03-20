import type { Article } from "#types/horizons/article";
import NextLink from "next/link";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Link, Typography } from "@mui/material";
import { calculateReadingTime } from "#utils/common/calculateReadingTime";

import { styles } from "./styles";

type ContentRelatedArticleProps = {
  article: Article;
  showCategoryOnCard: boolean;
};

const SimpleArticleListItemRendering = ({ article, showCategoryOnCard }: ContentRelatedArticleProps) => {
  return (
    <Box sx={styles.simpleArticleListItemWrapper}>
      <Box sx={styles.simpleArticleListItemMainContent}>
        <Box sx={styles.simpleArticleListItemTextWrapper}>
          <Link
            component={NextLink}
            href={`/horizons/${article.slug}`}
            underline="none"
            className="simple-article-list-item"
          >
            <Typography variant="cardTitleSmall" color="text.primary" m={0}>
              {article.title}
            </Typography>
          </Link>
          <Box sx={styles.simpleArticleListItemMetadata}>
            {showCategoryOnCard && (
              <Typography component="p" variant="overline" sx={styles.cardContentCategory(article.category)}>
                {article.category.name}
              </Typography>
            )}
            <Typography variant="cardMetadata" color="text.secondary" sx={styles.simpleArticleListItemReadingTime}>
              <AccessTimeIcon sx={styles.simpleArticleListItemReadingTimeIcon} />{" "}
              {calculateReadingTime(article.content.json)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleArticleListItemRendering;
