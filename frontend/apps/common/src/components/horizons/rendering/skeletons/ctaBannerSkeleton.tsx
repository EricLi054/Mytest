import { Box, Container, Skeleton } from "@mui/material";

const CTABannerSkeleton = ({ contentPosition = "Left" }) => {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: { xs: "436px", md: "480px" },
        backgroundColor: "#e0e0e0",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
      data-testid="cta-banner-skeleton"
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
        data-testid="skeleton-background"
      />
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: contentPosition === "Left" ? "flex-start" : "flex-end",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
        data-testid={`cta-content-${contentPosition.toLowerCase()}`}
      >
        <Box
          sx={{
            position: "absolute",
            height: "100%",
            top: 0,
            left: contentPosition === "Left" ? { xs: 0, md: "auto" } : "auto",
            right: contentPosition === "Right" ? { xs: 0, md: "auto" } : "auto",
            backgroundColor: "rgba(0, 22, 48, 0.6)",
            color: "#fff",
            px: { xs: 0, md: "24px" },
            maxWidth: { xs: "100%", md: "496px" },
            width: "100%",
            display: "flex",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            justifyContent: "center",
            flexDirection: "column",
            backdropFilter: "blur(3px)",
            padding: 3,
          }}
          data-testid="skeleton-overlay"
        >
          <Box px={3}>
            <Skeleton width="30%" height={20} sx={{ marginBottom: 1 }} data-testid="skeleton-category" />
            <Skeleton width="90%" height={50} sx={{ marginBottom: 2 }} data-testid="skeleton-heading" />
            <Skeleton width="80%" height={20} sx={{ marginBottom: 1 }} data-testid="skeleton-subtext-1" />
            <Skeleton width="60%" height={20} sx={{ marginBottom: 3 }} data-testid="skeleton-subtext-2" />
            <Skeleton variant="rectangular" width={120} height={40} data-testid="skeleton-cta-button" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CTABannerSkeleton;
