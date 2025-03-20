import type { Author } from "#types/horizons/author";
import type { ReactNode } from "react";
import { Box, Container, Grid2 } from "@mui/material";

import ArticleContentStickyBox from "../articleContentStickyBox";
import ArticleSummary from "../articleSummary";

type ArticleContentProps = {
  content: ReactNode;
  author: Author | null | undefined;
  plainTextPageContent: string;
  published: string;
  lastUpdated: string;
  showArticleSummary: boolean;
};

const ArticleContent = ({
  content,
  author,
  plainTextPageContent,
  published,
  lastUpdated,
  showArticleSummary,
}: ArticleContentProps) => {
  return (
    <Container maxWidth="lg" sx={{ position: "relative", py: 12 }}>
      <Grid2 container>
        <Grid2 size={{ lg: 2 }}>
          <ArticleContentStickyBox
            key="article-content-sticky-box"
            author={author}
            plainTextPageContent={plainTextPageContent}
            published={published}
            lastUpdated={lastUpdated}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 10, lg: 8 }} sx={{ margin: { xs: "auto" }, px: { xs: 2, md: 8, lg: 12 } }}>
          <Box>
            {showArticleSummary && <ArticleSummary />}
            {content}
          </Box>
        </Grid2>
        <Grid2 size={{ lg: 2 }} sx={{ display: { xs: "none", lg: "flex" } }}></Grid2>
      </Grid2>
    </Container>
  );
};

export default ArticleContent;
