import type { Tag } from "#types/common/contentfulTag";
import type { Author } from "#types/horizons/author";
import type { Category } from "#types/horizons/category";
import NextLink from "next/link";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Avatar, Box, Chip, Grid2, Link, Typography } from "@mui/material";
import { formatDate } from "#utils/common/formatDate";
import { toKebabCase } from "#utils/common/toKebabCase";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

import { CldImage } from "@racwa/ui";

import ShareButton from "../articleShareButton";
import ListenToArticle from "../listenToArticle";
import TextResizer from "../textResizer";
import { styles } from "./styles";

type ArticleHeroProps = {
  heading: string | null | undefined;
  heroImage: string | undefined;
  alt: string | null | undefined;
  leadParagraph: string | null | undefined;
  readingTime: string | null | undefined;
  author: Author | null | undefined;
  plainTextPageContent: string;
  published: string;
  lastUpdated: string;
  category: Category;
  tags?: Tag[] | null | undefined;
  renderTags: boolean;
};

const ArticleHero = ({
  heading,
  heroImage,
  alt,
  leadParagraph,
  readingTime,
  author,
  plainTextPageContent,
  published,
  lastUpdated,
  category,
  tags,
  renderTags,
}: ArticleHeroProps) => {
  return (
    <Grid2 container spacing={4}>
      <Grid2 size={{ xs: 12, md: 6 }} display="flex">
        <Box sx={styles.heroImage}>
          <CldImage
            environmentPath="/rac-horizons"
            src={heroImage ?? ""}
            alt={alt ?? ""}
            fill={true}
            sizes="100%"
            style={{ objectFit: "cover" }}
            quality="auto:eco"
            priority
          />
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }} display="flex">
        <Box sx={styles.heroContent}>
          <Box sx={styles.heroContentTextWrapper}>
            <Typography component="p" variant="overline" color={getAccentColourFromCategoryColour(category.colour)}>
              {category.name}
            </Typography>
            <Typography component="h1" variant="h1" color="inherit">
              {heading}
            </Typography>
            {leadParagraph && (
              <Typography component="p" variant="subtitle1" color="inherit" sx={styles.heroContentTeaserText} m={0}>
                {leadParagraph}
              </Typography>
            )}
            {author && (
              <Box sx={styles.heroContentArticleMetadata}>
                <Box sx={styles.heroContentAuthor}>
                  <Avatar
                    src={author.profilePicture[0]?.secure_url}
                    alt={`${author.name} profile picture`}
                    sx={styles.heroContentAuthorAvatar}
                  />
                  <Box sx={styles.heroContentAuthorName}>
                    <Typography component="p" variant="small" color="text.secondary" m={0}>
                      <Link
                        component={NextLink}
                        color="text.secondary"
                        href={`/horizons/authors/${author.slug}`}
                        underline="none"
                        prefetch={true}
                      >
                        by {author.name}
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            <Box sx={styles.heroContentContentUpdated}>
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
            <Typography component="p" variant="small" color="text.secondary" sx={styles.heroContentReadTime} m={0}>
              <AccessTimeIcon sx={styles.heroContentReadTimeIcon} /> {readingTime}
            </Typography>
          </Box>
          <Box sx={styles.heroContentUtilitiesWrapper}>
            {renderTags && (
              <Box sx={styles.heroContentTagsWrapper}>
                {tags?.map((tag) => (
                  <Chip
                    key={tag.id}
                    component={NextLink}
                    label={tag.name}
                    clickable
                    sx={styles.heroContentTag}
                    href={`/horizons/${category.slug}/${toKebabCase(tag.name)}`}
                    prefetch={true}
                  />
                ))}
              </Box>
            )}
            <Box sx={styles.heroUtilities}>
              <Box>
                <ShareButton heading={heading ?? ""} leadParagraph={leadParagraph ?? ""} />
              </Box>
              <Box sx={styles.heroContentTextSizeUtil}>
                <ListenToArticle plainTextPageContent={plainTextPageContent} />
                <TextResizer />
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid2>
    </Grid2>
  );
};

export default ArticleHero;
