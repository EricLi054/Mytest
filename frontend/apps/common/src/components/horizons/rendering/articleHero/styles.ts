import { typography } from "@racwa/styles";

export const styles = {
  heroSection: { position: "relative", display: "flex", flexDirection: { xs: "column", md: "row" } },
  heroImage: { position: "relative", width: "100%", height: { xs: "356px", md: "672px" } },
  heroContent: {
    pl: 2,
    pr: { xs: 3, md: 0 },
    pt: { xs: 3, md: 0 },
    pb: { xs: 3, md: 0 },
    mt: { xs: "-100px", md: "0" },
    display: "flex",
    flexDirection: "column",
    width: { lg: "440px", xs: "calc(100% - 20px)" },
    backgroundColor: "#FFFFFF",
  },
  heroContentTextWrapper: {
    alignItems: "center",
    mt: "auto",
    pb: { md: 0, xs: 4 },
  },
  heroContentTeaserText: {
    pb: 4,
    lineHeight: 1.75,
  },
  heroContentArticleMetadata: {
    display: "flex",
    justifyContent: "flex-start",
  },
  heroContentAuthor: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  heroContentAuthorAvatar: {
    display: { lg: "none" },
    width: 32,
    height: 32,
  },
  heroContentAuthorName: {
    display: { lg: "none" },
  },
  heroContentContentUpdated: {
    display: { lg: "none", xs: "flex" },
    py: 2,
  },
  heroContentReadTime: { display: "flex", alignItems: "center" },
  heroContentReadTimeIcon: { pr: 1, fontSize: "24px" },
  heroContentUtilitiesWrapper: {
    display: "flex",
    alignItems: { lg: "center", xs: "flex-start" },
    mt: "auto",
    justifyContent: "space-between",
    flexDirection: { lg: "row", xs: "column" },
    pb: 1,
  },
  heroContentTagsWrapper: { display: "flex", gap: 1, pb: { lg: 0, xs: 3 } },
  heroContentTag: {
    borderRadius: 1.5,
    backgroundColor: "#F3F3F3",
    fontWeight: 600,
    letterSpacing: 0.75,
    color: "#6F6F6F",
    fontFamily: typography.fontFamily,
  },
  heroUtilities: { display: "flex", gap: 1, width: { lg: "auto", xs: "100%" }, justifyContent: "space-between" },
  heroContentTextSizeUtil: { display: { lg: "none", xs: "flex" }, gap: 0, alignItems: "center" },
};
