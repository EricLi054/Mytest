import type { Category } from "#types/horizons/category";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

export const styles = {
  cardWrapper: (sectionColour: "White" | "Grey") => ({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    overflow: "visible",
    transition: "transform 0.3s",
    "&:hover .contentBox": {
      backgroundColor: sectionColour === "White" ? "#F3F3F3" : "#FFFFFF",
      transition: "background-color 0.3s",
    },
    "&:hover": {
      transform: "scale(1.02)",
    },
  }),
  cardImage: {
    position: "relative",
    height: "268px",
    width: "100%",
    objectFit: "cover",
  },
  cardContent: (sectionColour: "White" | "Grey") => ({
    position: "absolute",
    top: "220px",
    left: "-16px",
    backgroundColor: sectionColour === "White" ? "#FFFFFF" : "#F3F3F3",
    p: "16px",
    width: "100%",
    transition: "background-color 0.3s",
    minHeight: "160px",
    height: "auto",
  }),
  cardRichMedia: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    height: "30px",
    width: "auto",
    backgroundColor: "rgba(12, 55, 107, 0.75)",
    top: "-30px",
    px: 1,
  },
  cardRichMediaIcon: { pr: 1, fontSize: "24px" },
  cardContentMetadata: { display: "flex", alignItems: "center" },
  cardContentCategory: (category: Category) => ({
    color: getAccentColourFromCategoryColour(category.colour),
    mb: 0,
    pr: 2,
  }),
  cardContentReadingTime: { display: "flex", alignItems: "center" },
  cardContentReadingTimeIcon: { pr: 1, fontSize: "24px" },
};
