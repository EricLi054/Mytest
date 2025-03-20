import { Grid2, Skeleton } from "@mui/material";

type ArticleCardSkeletonProps = {
  count: number;
  xs: number;
  sm: number;
  md: number;
};

const ArticleCardSkeleton = ({ count, xs, sm, md }: ArticleCardSkeletonProps) => {
  return (
    <>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid2 key={index} size={{ xs, sm, md }} data-testid="article-card-skeleton-grid">
          <Skeleton variant="rectangular" height={200} data-testid="skeleton-image" />
          <Skeleton width="80%" height={60} data-testid="skeleton-title" />
          <Skeleton width="50%" data-testid="skeleton-subtitle" />
          <Skeleton width="40%" data-testid="skeleton-text" />
        </Grid2>
      ))}
    </>
  );
};

export default ArticleCardSkeleton;
