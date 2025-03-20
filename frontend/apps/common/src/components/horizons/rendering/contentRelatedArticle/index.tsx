import type { Article } from "#types/horizons/article";
import NextLink from "next/link";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Link, Typography } from "@mui/material";
import { calculateReadingTime } from "#utils/common/calculateReadingTime";
import { optimiseCloudinaryImage } from "#utils/horizons/optimiseCloudinaryImage";

import { styles } from "./styles";

type ContentRelatedArticleProps = {
  article: Article;
  showRelatedHeading: boolean;
  showCategoryOnCard: boolean;
};

const ContentRelatedArticleRendering = ({
  article,
  showRelatedHeading,
  showCategoryOnCard,
}: ContentRelatedArticleProps) => {
  return (
    <Box sx={styles.relatedContentWrapper}>
      <Link
        component={NextLink}
        href={`/horizons/${article.slug}`}
        underline="none"
        className="article-card-with-image"
      >
        {showRelatedHeading && (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            RELATED
          </Typography>
        )}
        <Box sx={styles.relatedContentMainContent}>
          <Box sx={styles.relatedContentImageWrapper}>
            <Box
              component="div"
              role="img"
              sx={styles.relatedContentImage(optimiseCloudinaryImage(article.tileImage?.image[0]?.secure_url ?? ""))}
            ></Box>
          </Box>
          <Box sx={styles.relatedContentTextWrapper}>
            <Box sx={styles.relatedContentMetadata}>
              {showCategoryOnCard && (
                <Typography component="p" variant="overline" sx={styles.relatedContentCategory(article.category)}>
                  {article.category.name}
                </Typography>
              )}
              <Typography variant="cardMetadata" color="text.secondary" sx={styles.relatedContentReadingTime}>
                <AccessTimeIcon sx={styles.relatedContentReadingTimeIcon} />{" "}
                {calculateReadingTime(article.content.json)}
              </Typography>
            </Box>
            <Typography variant="cardTitleSmall" color="text.primary" m={0}>
              {article.title}
            </Typography>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export default ContentRelatedArticleRendering;
