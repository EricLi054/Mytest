import { Box, Container, Skeleton, Typography } from "@mui/material";

const PageHeaderSkeleton = () => {
  return (
    <Box component="section" py={12} data-testid="page-header-skeleton">
      <Container maxWidth="lg">
        <Box sx={{ margin: "auto" }}>
          <Typography variant="h3" gutterBottom>
            <Skeleton width="20%" data-testid="skeleton-heading" />
          </Typography>
          {Array.from(new Array(3)).map((_, index) => (
            <Skeleton
              key={index}
              width="100%"
              height={24}
              sx={{ marginBottom: index < 2 ? 2 : 4 }}
              data-testid={`skeleton-line-${index}`}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default PageHeaderSkeleton;
