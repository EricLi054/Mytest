import type { Category } from "#types/horizons/category";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

export const styles = {
  relatedContentWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    py: 2,
  },
  relatedContentMainContent: {
    display: "flex",
    flexDirection: { xs: "row-reverse", sm: "row" },
    gap: 2,
    alignItems: "center",
  },
  relatedContentImageWrapper: {
    flex: "0 0 auto",
  },
  relatedContentImage: (imageUrl: string) => ({
    width: 100,
    height: 100,
    backgroundImage: `url("${imageUrl}")`,
    backgroundSize: "cover",
    backgroundPositionX: "100%",
  }),
  relatedContentTextWrapper: { flex: 1 },
  relatedContentMetadata: { display: "flex", alignItems: "center" },
  relatedContentCategory: (category: Category) => ({
    color: getAccentColourFromCategoryColour(category.colour),
    mb: 0,
    pr: 1,
  }),
  relatedContentReadingTime: { display: "flex", alignItems: "center", mb: 0 },
  relatedContentReadingTimeIcon: { pr: 1, fontSize: "24px" },
};
