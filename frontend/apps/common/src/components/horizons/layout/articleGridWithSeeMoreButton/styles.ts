import type { Category } from "#types/horizons/category";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

export const styles = {
  gridWithSeeMoreButtonCategoryHeader: (category: Category) => ({
    position: "relative",
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
  seeMoreButton: { textTransform: "none" },
};
