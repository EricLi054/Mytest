import type { ContentfulRichTextRendererProps } from '@/types/cmsTypes/ContentfulRichTextRendererProps';
import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer';
import { INLINES } from '@contentful/rich-text-types';
import Mustache from './Mustache';
import { baseOptions } from '@/utilities/richText/richTextBaseOptions';
import ContentfulLink from './ContentfulLink';
import ContentfulButton from './ContentfulButton/ContentfulButton';
import ContentfulGALink from './ContentfulGALink';
import { type Links } from '@/types/cmsTypes/RichTextProps';
import createEntryMap from '@/utilities/richText/createEntryMap';
import renderEmbeddedEntry from '@/utilities/richText/renderEmbeddedEntry';

const componentMap: Record<string, any> = {
  MustacheTemplates: Mustache,
  Link: ContentfulLink,
  Button: ContentfulButton
};

function renderOptions(links?: Links): Options {
  const entryMap = createEntryMap(links);

  return {
    renderNode: {
      ...baseOptions,
      [INLINES.ENTRY_HYPERLINK]: (node: any) => {
        return <ContentfulGALink data={node.data.target} />;
      },
      [INLINES.EMBEDDED_ENTRY]: (node: any) => {
        return renderEmbeddedEntry(node, entryMap, componentMap);
      }
    }
  };
}

function ContentfulRichTextRenderer({ text }: ContentfulRichTextRendererProps) {
  try {
    if (text?.json !== undefined) {
      return <>{documentToReactComponents(text?.json, renderOptions(text?.links))}</>;
    } else {
      throw new Error('Invalid text prop');
    }
  } catch (error) {
    console.error('Error: ContentfulRichTextRenderer.tsx - Error rendering rich text', error);
    return null;
  }
}

export default ContentfulRichTextRenderer;
