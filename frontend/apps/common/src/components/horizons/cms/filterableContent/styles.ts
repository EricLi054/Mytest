import type { Category } from "#types/horizons/category";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

import { typography } from "@racwa/styles";

export const styles = {
  filterableContentSection: (sectionColour: string) => ({
    backgroundColor: sectionColour === "White" ? "#FFFFFF" : "#F3F3F3",
    py: 8,
  }),
  filterableContentCategoryHeader: (category: Category) => ({
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
  filterableContentChip: (selectedTags: string[], tagName: string) => ({
    backgroundColor: selectedTags.includes(tagName) ? "#424242" : "#F3F3F3",
    color: selectedTags.includes(tagName) ? "#FFFFFF" : "#6F6F6F",
    "&:hover": {
      backgroundColor: selectedTags.includes(tagName) ? "#333333" : "#E0E0E0",
    },
    transition: "all 0.3s ease",
    borderRadius: 1.5,
    fontWeight: 500,
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily,
  }),
  filterableContentArticleCardWrapper: {
    height: { xs: "auto", md: "444px" },
    transition: "transform 0.3s ease",
    "&:hover": { transform: "scale(1.02)" },
  },
  filteredContentLoadMoreButton: { textTransform: "none", py: 1, fontSize: "16px" },
};
