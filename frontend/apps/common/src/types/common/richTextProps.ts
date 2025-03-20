import type { Document } from "@contentful/rich-text-types";

import type { Links } from "./richTextLinks";

export type RichTextProps = {
  json: Document;
  links?: Links;
};
