"use client";

import type { Article } from "#types/horizons/article";
import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { Box, Card, CardMedia, Link, Typography } from "@mui/material";

import { colors } from "@racwa/styles";
import { CldImage } from "@racwa/ui";

import { styles } from "./styles";

type ArticleCardProps = {
  article: Article;
  showCategoryOnCard: boolean;
};

const ArticleWithRichMediaCard = ({ article, showCategoryOnCard }: ArticleCardProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [initialHeight, setInitialHeight] = useState<number>(0);
  const [expandedHeight, setExpandedHeight] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setInitialHeight(scrollHeight);
      setExpandedHeight(scrollHeight + 16);
      setIsLoading(false);
    }
  }, [contentRef]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      component={NextLink}
      href={`/horizons/${article.slug}`}
      color={colors.white}
      underline="none"
      className="article-rich-media-card"
    >
      <Card
        sx={{
          ...styles.contentCard,
          visibility: isLoading ? "hidden" : "visible",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardMedia sx={styles.contentImage}>
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
        <Box
          ref={contentRef}
          className="content"
          sx={{
            ...styles.contentBody,
            height: isHovered ? `${expandedHeight}px` : `${initialHeight}px`,
            transition: "height 0.3s ease",
          }}
        >
          <Box px={3}>
            {showCategoryOnCard && (
              <Typography component="p" variant="overline">
                {article.category.name}
              </Typography>
            )}
            <Typography variant="cardTitleLarge" component="h3" mb={2}>
              {article.title}
            </Typography>
            {article.richMedia && (
              <Typography component="p" variant="overline" sx={styles.contentReadingTime}>
                <CldImage
                  environmentPath="/rac-horizons"
                  src="https://res.rac.com.au/rac-horizons/image/upload/v1740035397/Audio_podcast_bjvnvu.svg"
                  alt="Podcast symbol"
                  width={24}
                  height={16}
                  style={{ paddingRight: "8px", width: "auto", height: "auto" }}
                  quality="auto:eco"
                />
                {article.richMedia.durationValue}{" "}
                {
                  {
                    Minutes: article.richMedia.durationValue === 1 ? "min" : "mins",
                    Hours: article.richMedia.durationValue === 1 ? "hour" : "hours",
                  }[article.richMedia.durationUnit]
                }
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Link>
  );
};

export default ArticleWithRichMediaCard;
