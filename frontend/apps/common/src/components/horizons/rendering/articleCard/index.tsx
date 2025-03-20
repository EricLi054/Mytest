"use client";

import type { Article } from "#types/horizons/article";
import NextLink from "next/link";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Box, Card, CardContent, CardMedia, Link, Typography } from "@mui/material";
import { calculateReadingTime } from "#utils/common/calculateReadingTime";

import { CldImage } from "@racwa/ui";

import { styles } from "./styles";

type ArticleCardProps = {
  article: Article;
  showCategoryOnCard: boolean;
  sectionColour: "White" | "Grey";
};

const ArticleCard = ({ article, showCategoryOnCard, sectionColour = "White" }: ArticleCardProps) => {
  return (
    <>
      <Link
        component={NextLink}
        href={`/horizons/${article.slug}`}
        color="text.primary"
        underline="none"
        className="article-card"
      >
        <Card role="article" sx={styles.cardWrapper(sectionColour)}>
          <CardMedia sx={styles.cardImage}>
            <CldImage
              environmentPath="/rac-horizons"
              src={article.tileImage?.image[0]?.secure_url ?? ""}
              alt={
                article.tileImage?.image_data?.[0]?.context?.custom?.alt ??
                article.tileImage?.image[0]?.context?.custom?.alt ??
                ""
              }
              fill
              sizes="100%"
              quality="auto:low"
              style={{ objectFit: "cover" }}
            />
          </CardMedia>
          <CardContent className="contentBox" sx={styles.cardContent(sectionColour)}>
            {article.richMedia && (
              <Box sx={styles.cardRichMedia}>
                <Typography component="p" variant="overline" color="white" mb={0} display="flex" alignItems="center">
                  <PlayArrowIcon sx={styles.cardRichMediaIcon} />
                  {article.richMedia.durationValue}{" "}
                  {
                    {
                      Minutes: article.richMedia.durationValue === 1 ? "min" : "mins",
                      Hours: article.richMedia.durationValue === 1 ? "hour" : "hours",
                    }[article.richMedia.durationUnit]
                  }
                </Typography>
              </Box>
            )}
            <Box sx={styles.cardContentMetadata}>
              {showCategoryOnCard && (
                <Typography component="p" variant="overline" sx={styles.cardContentCategory(article.category)}>
                  {article.category.name}
                </Typography>
              )}
              <Typography variant="cardMetadata" color="text.secondary" sx={styles.cardContentReadingTime}>
                <AccessTimeIcon sx={styles.cardContentReadingTimeIcon} /> {calculateReadingTime(article.content.json)}
              </Typography>
            </Box>
            <Typography variant="cardTitleLarge" component="h3">
              {article.title}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </>
  );
};

export default ArticleCard;
