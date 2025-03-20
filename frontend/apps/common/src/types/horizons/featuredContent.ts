import type { ArticleCollection } from "./article";
import type { Category } from "./category";

export type ContentfulFeaturedContent = {
  data: {
    horizons_featuredContent: FeaturedContentProps;
  };
} | null;

export type FeaturedContentProps = {
  title: string;
  sectionColour: "White" | "Grey";
  category: Category;
  heading: string;
  cardType: "Article" | "Article with Rich Media";
  rendering: "Carousel" | "Grid" | "Grid with list" | "Grid with See More Button";
  seeMoreButtonText: string;
  seeMoreButtonUrl: string;
  showCategoryOnCard: boolean;
  showViewAllButton: boolean;
  viewAllButtonLink: string;
  articlesCollection: ArticleCollection | null;
};
