import { Box, Container, Grid2, Skeleton } from "@mui/material";

import ArticleCardSkeleton from "./articleCardSkeleton";

const ArticleGridSkeleton = () => {
  return (
    <Box component="section" py={12} data-testid="article-grid-skeleton">
      <Container maxWidth="lg">
        <Box sx={{ margin: "auto" }}>
          <Skeleton width="20%" height={40} data-testid="skeleton-heading" />
          <Skeleton width="10%" height={10} sx={{ mb: 6 }} data-testid="skeleton-subheading" />
          <Grid2 container spacing={4} data-testid="article-grid-container">
            <ArticleCardSkeleton count={6} xs={12} sm={6} md={4} />
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
};

export default ArticleGridSkeleton;
