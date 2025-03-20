import type { Category } from "#types/horizons/category";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

export const styles = {
  carouselCategoryHeader: (category: Category) => ({
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
  carouselNavButton: {
    width: "46px",
    height: "46px",
    color: "#0062B2",
    "&:disabled": {
      color: "#CCE0F0",
    },
  },
  carouselNavButtonIcon: {
    fontSize: "46px",
  },
  carouselOffscreenWrapper: {
    width: "100%",
    height: "400px",
    position: "relative",
    overflow: "hidden",
  },
  carouselItemsWrapper: {
    width: "100%",
    maxWidth: "1248px",
    mx: "auto",
  },
  carouselItemsRowWrapper: (currentIndex: number, cardGap: number, cardType: string) => ({
    transition: "transform 0.5s ease",
    transform: `translateX(-${currentIndex * (100 + cardGap)}%)`,
    pl: { xs: 2, sm: 3 },
    height: cardType === "Article" ? { xs: "460px", sm: "480px", md: "500px", lg: "468px" } : "360px",
  }),
  carouselItemWrapper: (visibleCount: number, cardGap: number) => ({
    flex: `0 0 calc((100% - ${(visibleCount - 1) * cardGap}%) / ${visibleCount})`,
  }),
  viewAllCard: (sectionColour: "White" | "Grey", cardType: "" | "Article" | "Article with Rich Media") => ({
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: cardType === "Article" ? "380px" : "320px",
    borderRadius: 0,
    boxShadow: "none",
    flexDirection: "column",
    overflow: "visible",
    transition: "transform 0.3s",
    backgroundColor: sectionColour === "White" ? "#FFFFFF" : "#F3F3F3",
    "&:hover": {
      transform: "scale(1.02)",
      backgroundColor: sectionColour === "White" ? "#F3F3F3" : "#FFFFFF",
    },
  }),
};
