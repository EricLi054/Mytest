import type { Options } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import type { TypographyProps } from "@mui/material";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import { baseOptions } from "./options";

type RichTextRendererProps = {
  json: Document;
  paragraphProps?: TypographyProps;
};

function renderOptions(paragraphProps?: TypographyProps): Options {
  return {
    renderNode: {
      ...baseOptions(paragraphProps),
    } as Options["renderNode"],
  };
}

function RichTextRenderer({ json, paragraphProps }: RichTextRendererProps) {
  try {
    return <>{documentToReactComponents(json, renderOptions(paragraphProps))}</>;
  } catch (error) {
    console.error("Error rendering rich text", error);
    return null;
  }
}

export default RichTextRenderer;
