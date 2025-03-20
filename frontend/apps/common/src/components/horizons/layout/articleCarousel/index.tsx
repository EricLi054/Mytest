"use client";

import type { Article } from "#types/horizons/article";
import type { Category } from "#types/horizons/category";
import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, ButtonBase, Card, Container, IconButton, Link, Typography, useTheme } from "@mui/material";
import { useIsMobile } from "#hooks/common/useIsMobile";
import { useIsTablet } from "#hooks/common/useIsTablet";
import { logEvent } from "#utils/common/analyticsTagging";
import { useSwipeable } from "react-swipeable";

import ArticleCard from "../../rendering/articleCard";
import ArticleWithRichMediaCard from "../../rendering/articleWithRichMediaCard";
import { styles } from "./styles";

type ArticleCarouselProps = {
  category: Category;
  heading: string;
  articles: Article[];
  cardType: "" | "Article" | "Article with Rich Media";
  showCategoryOnCard: boolean;
  showViewAllButton: boolean;
  viewAllButtonLink: string;
  sectionColour: "White" | "Grey";
};

const ArticleCarousel = ({
  heading,
  category,
  articles,
  cardType,
  showCategoryOnCard,
  showViewAllButton,
  viewAllButtonLink,
  sectionColour,
}: ArticleCarouselProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const visibleCount = isMobile ? 1.5 : isTablet ? 2.5 : 3.5;
  const cardGap = cardType === "Article" ? (isMobile ? 4 : isTablet ? 3 : 2) : isMobile ? 6 : isTablet ? 5 : 4;
  const maxIndex = Math.ceil((articles.length + (showViewAllButton ? 1 : 0)) / visibleCount) - 1;

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 0.3s ease";
      trackRef.current.style.transform = `translateX(-${currentIndex * (100 + cardGap)}%)`;
    }
  }, [currentIndex, cardGap]);

  const handleSwipe = (deltaX: number) => {
    if (trackRef.current) {
      if (currentIndex === 0 && deltaX > 0) {
        return;
      }

      if (currentIndex === maxIndex && deltaX < 0) {
        return;
      }

      const newTranslateX = -currentIndex * (100 + cardGap) + (deltaX / window.innerWidth) * 100;
      trackRef.current.style.transform = `translateX(${newTranslateX}%)`;
      trackRef.current.style.transition = "none";
    }
  };

  const handleSwipeEnd = (deltaX: number) => {
    logEvent(`Article Carousel - ${heading} - Swipe`);
    let newIndex = currentIndex;

    if (deltaX < -50) {
      newIndex = Math.min(currentIndex + 1, maxIndex);
    } else if (deltaX > 50) {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    } else {
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 0.3s ease";
        trackRef.current.style.transform = `translateX(-${newIndex * (100 + cardGap)}%)`;
      }
    }
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => handleSwipe(eventData.deltaX),
    onSwiped: (eventData) => handleSwipeEnd(eventData.deltaX),
    preventScrollOnSwipe: true,
  });

  return (
    <>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Typography variant="h2" component="h2" sx={styles.carouselCategoryHeader(category)}>
            {heading}
          </Typography>
          {!isTouchDevice && (
            <Box>
              <IconButton
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
                sx={styles.carouselNavButton}
                className="carousel-prev-icon"
              >
                <ChevronLeftIcon sx={styles.carouselNavButtonIcon} className="carousel-prev-icon" />
              </IconButton>
              <IconButton
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))}
                disabled={currentIndex >= maxIndex}
                sx={styles.carouselNavButton}
                className="carousel-next-icon"
              >
                <ChevronRightIcon sx={styles.carouselNavButtonIcon} className="carousel-next-icon" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Container>
      <Box sx={styles.carouselOffscreenWrapper} {...handlers}>
        <Box sx={styles.carouselItemsWrapper}>
          <Box
            ref={trackRef}
            display="flex"
            gap={`${cardGap}%`}
            sx={styles.carouselItemsRowWrapper(currentIndex, cardGap, cardType)}
          >
            {articles.map((article: Article, index: number) => (
              <Box key={index} sx={styles.carouselItemWrapper(visibleCount, cardGap)}>
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
              </Box>
            ))}
            {showViewAllButton && (
              <Box
                key={`${heading}-${category.name}-show-view-all-button`}
                sx={styles.carouselItemWrapper(visibleCount, cardGap)}
              >
                <Link component={NextLink} href={viewAllButtonLink} underline="none" color="text.primary">
                  <Card sx={styles.viewAllCard(sectionColour, cardType)}>
                    <Box>
                      <Typography
                        variant="cardTitleLarge"
                        component="h3"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        View All <ArrowForwardIcon sx={{ ml: 1 }} />
                      </Typography>
                    </Box>
                  </Card>
                </Link>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
          }}
        >
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <ButtonBase
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="carousel-dot-icon"
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: i === currentIndex ? theme.palette.primary.main : theme.palette.grey[400],
                mx: 0.5,
              }}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default ArticleCarousel;
