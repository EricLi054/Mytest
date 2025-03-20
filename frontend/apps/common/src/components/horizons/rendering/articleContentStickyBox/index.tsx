"use client";

import type { Author } from "#types/horizons/author";
import NextLink from "next/link";
import { Avatar, Box, Link, styled, Typography } from "@mui/material";
import { formatDate } from "#utils/common/formatDate";

import ListenToArticle from "../listenToArticle";
import TextResizer from "../textResizer";
import { styles } from "./styles";

const StyledStickyBox = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 20,
  backgroundColor: theme.palette.background.default,
  zIndex: 1,
}));

type ArticleContentStickyBoxProps = {
  author: Author | null | undefined;
  plainTextPageContent: string;
  published: string;
  lastUpdated: string;
};

const ArticleContentStickyBox = ({
  author,
  plainTextPageContent,
  published,
  lastUpdated,
}: ArticleContentStickyBoxProps) => {
  return (
    <StyledStickyBox>
      {author && (
        <Box sx={styles.contentArticleMetadata}>
          <Box sx={styles.contentAuthor}>
            <Avatar
              src={author.profilePicture[0]?.secure_url}
              alt={`${author.name} profile picture`}
              sx={styles.contentAuthorAvatar}
            />
            <Box>
              <Typography component="p" variant="small" color="text.secondary" m={0}>
                <Link
                  component={NextLink}
                  color="text.secondary"
                  href={`/horizons/authors/${author.slug}`}
                  underline="none"
                >
                  by {author.name}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      <Box sx={styles.contentUpdated}>
        <Typography component="p" variant="small" color="text.secondary" m={0}>
          {lastUpdated !== "" && (
            <>
              <Typography component="span" variant="small">
                <b>Updated</b>
              </Typography>{" "}
              <Typography component="span" variant="small">
                {formatDate(lastUpdated)}
              </Typography>{" "}
              •{" "}
            </>
          )}
          {published !== "" && (
            <>
              <Typography component="span" variant="small">
                <b>Published</b>
              </Typography>{" "}
              <Typography component="span" variant="small">
                {formatDate(published)}
              </Typography>
            </>
          )}
        </Typography>
      </Box>
      <Box sx={styles.contentTextSizeUtil}>
        <ListenToArticle plainTextPageContent={plainTextPageContent} />
        <TextResizer />
      </Box>
    </StyledStickyBox>
  );
};

export default ArticleContentStickyBox;
