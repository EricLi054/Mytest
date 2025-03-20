"use client";

import type { InstagramPostEmbedProps } from "#types/horizons/instagramPost";
import NextLink from "next/link";
import Script from "next/script";
import { Box, Link, Typography } from "@mui/material";

import { styles } from "./styles";

const InstagramPostRendering = ({ title, postUrl }: InstagramPostEmbedProps) => {
  const permalink = postUrl.replace("/embed", "");

  return (
    <>
      <Box sx={styles.instagramPostWrapper}>
        <Box
          component="blockquote"
          className="instagram-media"
          data-instgrm-permalink={permalink}
          data-instgrm-version="14"
          title={title}
          sx={styles.instagramPost}
        >
          <Box sx={styles.instagramPostLoader}>
            <Link
              component={NextLink}
              href={`${permalink}/?utm_source=ig_embed&amp;utm_campaign=loading`}
              sx={styles.instagramPostLoaderLinkWrapper}
              underline="none"
            >
              <Box sx={styles.instagramPostSkeletonWrapper1}>
                <Box sx={styles.instagramPostSkeletonAvatar}></Box>
                <Box sx={styles.instagramPostSkeletonTextWrapper}>
                  <Box sx={styles.instagramPostSkeletonTextItem1}></Box>
                  <Box sx={styles.instagramPostSkeletonTextItem2}></Box>
                </Box>
              </Box>
              <Box padding="20% 0"></Box>
              <Box>
                <Typography variant="body2" sx={styles.instagramPostViewPostText}>
                  <b>View this post on Instagram</b>
                </Typography>
              </Box>
              <Box padding="12.5% 0"></Box>
              <Box sx={styles.instagramPostSkeletonMetadataWrapper}>
                <Box>
                  <Box sx={styles.instagramPostSkeletonLoveHeartLeft}></Box>
                  <Box sx={styles.instagramPostSkeletonLoveHeartMiddle}></Box>
                  <Box sx={styles.instagramPostSkeletonLoveHeartRight}></Box>
                </Box>
                <Box marginLeft="8px">
                  <Box sx={styles.instagramPostSkeletonCommentLeft}></Box>
                  <Box sx={styles.instagramPostSkeletonCommentRight}></Box>
                </Box>
                <Box marginLeft="auto">
                  <Box sx={styles.instagramPostSkeletonBookmarkLeft}></Box>
                  <Box sx={styles.instagramPostSkeletonBookmarkMiddle}></Box>
                  <Box sx={styles.instagramPostSkeletonBookmarkRight}></Box>
                </Box>
              </Box>
              <Box sx={styles.instagramPostSkeletonWrapper2}>
                <Box sx={styles.instagramPostSkeletonTextItem3}></Box>
                <Box sx={styles.instagramPostSkeletonTextItem4}></Box>
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
      <Script src="https://www.instagram.com/embed.js" strategy="afterInteractive" />
    </>
  );
};

export default InstagramPostRendering;
