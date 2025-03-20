import type { ArticleCollection } from "./article";
import type { PageCollection } from "./page";

export type ContentfulSharedCollectionData = {
  data: {
    horizons_articleCollection: ArticleCollection;
    horizons_pageCollection: PageCollection;
  };
} | null;
