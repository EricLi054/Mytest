import type { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import type { ComponentMapperType } from "#types/ComponentMapperType";
import type { z } from "zod";

import InternalRichTextRenderer from "../InternalRichTextRenderer";
import MustacheTemplates from "../Mustache";

const serverComponentMap: ComponentMapperType = {
  MustacheTemplates,
};

export default function ContentfulRichTextRenderer({ text }: { text: z.infer<typeof RichTextSchema> }) {
  return <InternalRichTextRenderer text={text} serverSideComponents={serverComponentMap} />;
}
