import type { ContentfulMetadata } from "#types/common/contentfulMetadata";

import type { Category } from "./category";

export type ContentfulFilterableContent = {
  data: {
    horizons_filterableContent: FilterableContentProps;
  };
} | null;

export type FilterableContentProps = {
  title: string;
  slug: string;
  sectionColour: "White" | "Grey";
  category: Category;
  heading: string;
  filterBy: "Category" | "Tags";
  showTagFilters: boolean;
  showCategoryOnCard: boolean;
  contentfulMetadata: ContentfulMetadata;
};
