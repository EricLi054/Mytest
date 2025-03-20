import type { Document } from "@contentful/rich-text-types";

export type RichText = {
  text: {
    json: Document;
    // links?: Links;
  };
};
export type Links = {
  entries: {
    inline: Entry[];
  };
};

export type Entry = {
  sys: {
    id: string;
  };
  __typename: string;
  template?: string;
  advancedTemplate?: string;
  defaultValue?: string;
};
