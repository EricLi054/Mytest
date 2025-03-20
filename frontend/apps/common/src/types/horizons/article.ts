import type { ContentfulMetadata } from "#types/common/contentfulMetadata";
import type { RichTextProps } from "#types/common/richTextProps";
import type { SeoMetaTags } from "#types/common/seoMetaTags";

import type { CloudinaryAsset } from "@racwa/ui";

import type { Author } from "./author";
import type { Category } from "./category";
import type { ComponentItem } from "./componentItem";
import type { YoutubeEmbedProps } from "./youtubeEmbed";

export type ContentfulArticleCollectionData = {
  data: {
    horizons_articleCollection: ArticleCollection;
  };
} | null;

export type ContentfulArticleData = {
  data: {
    horizons_article: Article;
  };
} | null;

export type ArticleCollection = {
  items: Article[];
};

export type Article = {
  title: string | null;
  slug: string | null;
  seoMetaTags: SeoMetaTags | null;
  redirectUrl: string | null;
  bannerImage: CloudinaryAsset;
  tileImage: CloudinaryAsset | null;
  category: Category;
  lastUpdated: string | null;
  published: string | null;
  leadParagraph: string | null;
  renderTags: boolean;
  showArticleSummary: boolean;
  content: RichTextProps;
  author: Author | null;
  relatedArticlesCollection: RelatedArticleItems;
  contentfulMetadata: ContentfulMetadata | null;
  sys: {
    publishedVersion: number;
    publishedAt: string | null;
    firstPublishedAt: string | null;
  };
  richMedia?: YoutubeEmbedProps;
};

export type RelatedArticleItems = {
  items: ComponentItem[];
};
