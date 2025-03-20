import type { Category } from "#types/horizons/category";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

export const styles = {
  contentArticleImageAndPlayButtonWrapper: {
    borderRadius: 1,
    boxShadow: 0,
    position: "relative",
    overflow: "hidden",
    mb: 2,
  },
  contentArticleImage: {
    position: "relative",
    height: "444px",
    filter: "brightness(85%)",
  },
  contentArticlePlayButton: (category: Category) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: getAccentColourFromCategoryColour(category.colour),
    borderRadius: "50%",
    width: 60,
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  }),
  contentArticlePlayButtonIcon: { color: "white", fontSize: 36 },
};
