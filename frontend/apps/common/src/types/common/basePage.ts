import type { ContentfulItem } from "./contentfulItem";
import type { SeoMetaData } from "./seoMetaData";

export type ContentfulBasePage = {
  data: {
    rac_basePageCollection: BasePageCollection;
  };
};

export type BasePageCollection = {
  items: WebsitePage[];
};

export type WebsitePage = {
  slug: string;
  nameOfInstance: string;
  seoMetaTags: SeoMetaData | null;
  banner: ContentfulItem | null;
  contentCollection: ContentfulItemCollection | null;
};

export type ContentfulItemCollection = {
  content: ContentfulItem | null;
};
