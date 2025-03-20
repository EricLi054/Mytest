import type { ComponentSwitchableProps } from "#components/ComponentSwitcher/types";

import ContentfulRichTextRenderer from "../RichText/ContentfulRichTextRenderer";
import { getTypographyData } from "./data";

async function Typography({ id }: ComponentSwitchableProps) {
  const resultData = await getTypographyData(id);
  if (resultData === null) return null;

  return <ContentfulRichTextRenderer text={resultData.text} />;
}

export default Typography;
