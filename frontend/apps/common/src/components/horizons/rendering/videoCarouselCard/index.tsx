"use client";

import type { Category } from "#types/horizons/category";
import type { YoutubeEmbedProps } from "#types/horizons/youtubeEmbed";
import { useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Backdrop, Box, CardMedia, Link, Portal, Typography } from "@mui/material";

import { CldImage } from "@racwa/ui";

import { styles } from "./styles";

type ArticleCardProps = {
  video: YoutubeEmbedProps;
  category: Category;
};

const VideoCarouselCard = ({ video, category }: ArticleCardProps) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Link onClick={handleOpen} sx={{ cursor: "pointer" }} underline="none" role="button">
        <Box sx={styles.contentArticleImageAndPlayButtonWrapper}>
          <CardMedia sx={styles.contentArticleImage}>
            <CldImage
              environmentPath="/rac-horizons"
              src={video.videoImageThumbnail?.image[0]?.secure_url ?? ""}
              alt={video.url}
              fill
              sizes="100%"
              quality="auto:low"
              style={{ objectFit: "cover" }}
            />
          </CardMedia>
          <Box sx={styles.contentArticlePlayButton(category)}>
            <PlayArrowIcon sx={styles.contentArticlePlayButtonIcon} />
          </Box>
        </Box>
        <Typography variant="cardTitleLarge" component="h3" role="heading" color="textPrimary">
          {video.title}
        </Typography>
      </Link>
      <Portal>
        <Backdrop
          sx={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 2 }}
          open={open}
          onClick={handleClose}
          data-testid="video-backdrop"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {open && (
              <Box
                component="iframe"
                src={video.url}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{
                  width: { xs: "90%", sm: "70%", md: "80%", lg: "80%", xl: "80%" },
                  maxWidth: "1200px",
                  aspectRatio: { xs: "9/16", md: "16/9" },
                  border: 0,
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
                  outline: "none",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </Box>
        </Backdrop>
      </Portal>
    </>
  );
};

export default VideoCarouselCard;
