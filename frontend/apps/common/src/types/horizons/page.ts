import type { SeoMetaTags } from "#types/common/seoMetaTags";

import type { ComponentItem } from "./componentItem";

export type ContentfulPageCollectionData = {
  data: {
    horizons_pageCollection: PageCollection;
  };
} | null;

export type PageCollection = {
  items: Page[];
};

export type Page = {
  title: string | null;
  slug: string | null;
  seoMetaTags: SeoMetaTags | null;
  contentCollection: NestedPageContent | null;
  sys: {
    publishedVersion: number;
    publishedAt: string | null;
    firstPublishedAt: string | null;
  };
};

export type NestedPageContent = {
  items: ComponentItem[];
};
