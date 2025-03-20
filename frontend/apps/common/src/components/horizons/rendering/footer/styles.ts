import { typography } from "@racwa/styles";

export const styles = {
  footerBox: {
    backgroundColor: "#F3F3F3",
    py: 4,
    borderTop: "1px solid #e6e6e6",
  },
  footerTopSection: {
    display: "flex",
    flexDirection: { xs: "column", sm: "column", md: "row" },
    alignItems: { sm: "flex-start", md: "center" },
    textAlign: "left",
    mb: 4,
  },
  footerPrimaryLogo: { mb: { xs: 2, sm: 2, md: 0 } },
  footerSecondaryLogo: { ml: { xs: 0, md: "auto" }, mt: { xs: 2, sm: 2, md: 0 }, pl: { xs: 0, md: 3 } },
  footerMainNavLinks: {
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    ml: { xs: 0, md: 8 },
    mt: { xs: 2, sm: 2, md: 0 },
    mb: { xs: 2, sm: 2, md: 0 },
  },
  footerNavLink: {
    color: "#333333",
    fontFamily: typography.fontFamily,
    fontSize: "15px",
    fontWeight: 400,
  },
  footerBottomSection: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    alignItems: { xs: "flex-start", md: "center" },
    justifyContent: "space-between",
    gap: 2,
  },
  footerLegalLinks: {
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  footerLegalLink: {
    color: "#666666",
    fontFamily: typography.fontFamily,
    fontSize: "15px",
    fontWeight: 400,
  },
  footerSocialIcons: {
    display: "flex",
    justifyContent: { xs: "flex-start", md: "flex-end" },
    mt: { xs: 2, md: 0 },
    gap: 1,
  },
  footerSocialIcon: { color: "#666666", fontSize: 24 },
};
