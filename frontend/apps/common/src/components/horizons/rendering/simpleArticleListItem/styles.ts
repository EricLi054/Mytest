import type { Category } from "#types/horizons/category";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

export const styles = {
  simpleArticleListItemWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    pb: 2,
  },
  simpleArticleListItemMainContent: {
    display: "flex",
    flexDirection: { xs: "row-reverse", sm: "row" },
    gap: 2,
    alignItems: "center",
  },
  simpleArticleListItemImageWrapper: {
    flex: "0 0 auto",
  },
  simpleArticleListItemTextWrapper: { flex: 1 },
  simpleArticleListItemMetadata: { display: "flex", alignItems: "center" },
  cardContentCategory: (category: Category) => ({
    color: getAccentColourFromCategoryColour(category.colour),
    mb: 0,
    pr: 2,
  }),
  simpleArticleListItemReadingTime: { display: "flex", alignItems: "center", mb: 0, fontSize: "16px" },
  simpleArticleListItemReadingTimeIcon: { pr: 1, fontSize: "24px" },
};
