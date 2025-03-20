import { Box, Container, Grid2, Skeleton, Typography } from "@mui/material";

import ArticleCardSkeleton from "./articleCardSkeleton";

const ArticleGridWithListSkeleton = () => {
  return (
    <Box component="section" py={12} data-testid="article-grid-with-list-skeleton">
      <Container maxWidth="lg">
        <Box sx={{ margin: "auto" }}>
          <Typography variant="h4" gutterBottom>
            <Skeleton width="10%" data-testid="skeleton-heading" />
          </Typography>
          <Skeleton
            variant="rectangular"
            width="5%"
            height={6}
            sx={{ marginBottom: 4 }}
            data-testid="skeleton-red-line"
          />
          <Grid2 container spacing={4} data-testid="article-grid-container">
            <Grid2 size={{ xs: 12, md: 8 }} data-testid="left-article-grid">
              <Grid2 container spacing={4}>
                <ArticleCardSkeleton count={2} xs={12} sm={12} md={6} />
              </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }} data-testid="right-article-list">
              <Grid2 container direction="column" spacing={4}>
                {Array.from(new Array(3)).map((_, index) => (
                  <Grid2 key={index} data-testid="list-skeleton-item">
                    <Skeleton width="80%" height={40} data-testid="skeleton-list-title" />
                    <Skeleton width="40%" data-testid="skeleton-list-subtitle" />
                  </Grid2>
                ))}
                <Box sx={{ marginTop: 2 }} data-testid="skeleton-load-more">
                  <Skeleton variant="rectangular" width="40%" height={36} />
                </Box>
              </Grid2>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
};

export default ArticleGridWithListSkeleton;
