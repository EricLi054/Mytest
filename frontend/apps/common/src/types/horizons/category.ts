export type ContentfulCategoryCollectionData = {
  data: {
    horizons_categoryCollection: CategoryCollection;
  };
} | null;

export type CategoryCollection = {
  items: Category[];
};

export type Category = {
  name: string;
  slug: string;
  colour: string;
};
