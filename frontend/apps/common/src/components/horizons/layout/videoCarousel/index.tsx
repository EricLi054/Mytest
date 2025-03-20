"use client";

import type { Category } from "#types/horizons/category";
import type { YoutubeEmbedProps } from "#types/horizons/youtubeEmbed";
import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, ButtonBase, Container, IconButton, Typography, useTheme } from "@mui/material";
import { useIsMobile } from "#hooks/common/useIsMobile";
import { useIsTablet } from "#hooks/common/useIsTablet";
import { useSwipeable } from "react-swipeable";

import VideoCarouselCard from "../../rendering/videoCarouselCard";
import { styles } from "./styles";

type ArticleCarouselProps = {
  category: Category;
  heading: string;
  videos: YoutubeEmbedProps[];
  seeMoreButtonText?: string;
  seeMoreButtonUrl?: string;
};

const VideoCarouselLayoutRendering = ({
  heading,
  category,
  videos,
  seeMoreButtonText,
  seeMoreButtonUrl,
}: ArticleCarouselProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const visibleCount = isMobile ? 1.5 : isTablet ? 2.5 : 3.5;
  const cardGap = 4;
  const maxIndex = Math.ceil(videos.length / visibleCount) - 1;

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 0.3s ease";
      trackRef.current.style.transform = `translateX(-${currentIndex * (100 + cardGap)}%)`;
    }
  }, [currentIndex]);

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
              >
                <ChevronLeftIcon sx={styles.carouselNavButtonIcon} />
              </IconButton>
              <IconButton
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))}
                disabled={currentIndex >= maxIndex}
                sx={styles.carouselNavButton}
              >
                <ChevronRightIcon sx={styles.carouselNavButtonIcon} />
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
            sx={styles.carouselItemsRowWrapper(currentIndex, cardGap)}
          >
            {videos.map((video: YoutubeEmbedProps, index: number) => (
              <Box key={index} sx={styles.carouselItemWrapper(visibleCount, cardGap)}>
                <VideoCarouselCard category={category} video={video} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <ButtonBase
              key={i}
              onClick={() => setCurrentIndex(i)}
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
        <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
          {seeMoreButtonText && seeMoreButtonUrl && (
            <Button
              LinkComponent={NextLink}
              variant="outlined"
              color="primary"
              size="large"
              href={seeMoreButtonUrl}
              role="button"
              className="btn-white-cta"
            >
              {seeMoreButtonText}
            </Button>
          )}
        </Box>
      </Container>
    </>
  );
};

export default VideoCarouselLayoutRendering;
