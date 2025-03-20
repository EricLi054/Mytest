export const styles = {
  authorLatestArticlesWrapperDesktop: { py: 8, display: { xs: "none", sm: "block" } },
  authorLatestArticlesWrapperMobile: { py: 8, px: 2, display: { xs: "block", sm: "none" } },
  authorLatestArticlesMobileHeader: {
    position: "relative",
    "&:after": {
      content: '""',
      display: "block",
      width: "100%",
      height: "4px",
      backgroundColor: "#0C376B",
      position: "absolute",
      bottom: -12,
      left: 0,
    },
  },
};
