import { typography } from "@racwa/styles";

export const styles = {
  ctaWrapper: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: "center",
    position: "relative",
    backgroundColor: "#ffd000",
    py: 3,
    mb: 2,
  },
  ctaImage: {
    position: { xs: "relative", md: "absolute" },
    left: 0,
    mt: { xs: "-30%", md: 0 },
    height: "auto",
    width: { lg: 420, md: 360, xs: "calc(100% - 64px)" },
    ml: { lg: "-200px", md: "-170px" },
  },
  ctaContentWrapper: {
    flex: 1,
    backgroundColor: "#ffd000",
    px: 4,
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
  },
  ctaButton: {
    width: "fit-content",
    height: 50,
    textTransform: "none",
    backgroundColor: "#263d4f",
    fontFamily: typography.fontFamily,
    fontSize: 16,
    borderRadius: "4px",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#1e3040",
      boxShadow: "none",
    },
  },
};
