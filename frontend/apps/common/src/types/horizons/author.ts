import type { RichTextProps } from "#types/common/richTextProps";

import type { CloudinaryImage } from "@racwa/ui";

import type { ArticleCollection } from "./article";

export type ContentfulAuthorCollectionData = {
  data: {
    horizons_authorCollection: AuthorCollection;
    horizons_articleCollection?: ArticleCollection;
  };
} | null;

export type AuthorCollection = {
  items: Author[];
};

export type Author = {
  name: string;
  slug?: string;
  bio: RichTextProps;
  profilePicture: CloudinaryImage[];
};
