import type { Category } from "#types/horizons/category";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

export const styles = {
  linkListSection: (sectionColour: string) => ({
    backgroundColor: sectionColour === "White" ? "#FFFFFF" : "#F3F3F3",
    py: 12,
  }),
  linkListCategoryHeader: (category: Category) => ({
    position: "relative",
    mt: 0,
    "&:after": {
      content: '""',
      display: "block",
      width: "100%",
      height: "4px",
      backgroundColor: getAccentColourFromCategoryColour(category.colour),
      position: "absolute",
      bottom: -12,
      left: 0,
    },
  }),
  headerBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mb: 6,
  },
  gridContainer: {
    maxWidth: "784px",
    mx: "auto",
  },
  topicGridItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  topicLink: {
    width: "100%",
    height: "230px",
    color: "#0C376B",
    display: "grid",
  },
  topicImageWrapper: {
    position: "relative",
    minWidth: { xs: "100%", md: "155px" },
    width: "100%",
    height: "182px",
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    border: "1px solid #DDD",
    borderBottom: "none",
  },
  topicImage: {
    objectFit: "cover",
  },
  topicDescriptionBox: {
    backgroundColor: "#FFFFFF",
    minWidth: { xs: "100%", md: "155px" },
    maxWidth: "100%",
    height: "48px",
    py: 2,
    m: 0,
    border: "1px solid #DDD",
    borderTop: "none",
    fontWeight: 500,
    fontSize: "16px !important",
    lineHeight: "1 !important",
  },
  viewMoreButtonBox: {
    textAlign: "center",
    mt: 6,
  },
};
