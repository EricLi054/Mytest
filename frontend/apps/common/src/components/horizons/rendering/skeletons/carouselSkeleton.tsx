import { Box, Container, Grid2, Skeleton, Typography } from "@mui/material";

import ArticleCardSkeleton from "./articleCardSkeleton";

export default function CarouselSkeleton() {
  const cardCounts = {
    xs: 1,
    sm: 2,
    md: 3,
  };
  return (
    <Box component="section" py={12} data-testid="carousel-skeleton">
      <Container maxWidth="lg">
        <Box sx={{ margin: "auto" }}>
          <Typography variant="h4" gutterBottom>
            <Skeleton width="15%" data-testid="skeleton-heading" />
          </Typography>
          <Skeleton
            variant="rectangular"
            width="8%"
            height={6}
            sx={{ marginBottom: 4 }}
            data-testid="skeleton-red-line"
          />
          {Object.entries(cardCounts).map(([breakpoint, count]) => (
            <Box
              key={breakpoint}
              display={{
                xs: breakpoint === "xs" ? "block" : "none",
                sm: breakpoint === "sm" ? "block" : "none",
                md: breakpoint === "md" ? "block" : "none",
              }}
              data-testid={`carousel-breakpoint-${breakpoint}`}
            >
              <Grid2 container spacing={2}>
                <ArticleCardSkeleton count={count} xs={12} sm={6} md={4} />
              </Grid2>
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }} data-testid="skeleton-pagination">
            {Array.from(new Array(3)).map((_, index) => (
              <Skeleton
                key={index}
                variant="circular"
                width={12}
                height={12}
                sx={{ margin: "0 8px" }}
                data-testid="skeleton-pagination-dot"
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
