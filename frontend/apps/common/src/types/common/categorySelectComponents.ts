import type { ContentfulItem } from "./contentfulItem";

export type ContentfulCategorySelectComponents = {
  rac_categorySelect: CategorySelectComponentCollection;
};

export type CategorySelectComponentCollection = {
  categoryName: string;
  contentCollection: CategorySelectItemCollection;
};

export type CategorySelectItemCollection = {
  items: ContentfulItem[];
};
