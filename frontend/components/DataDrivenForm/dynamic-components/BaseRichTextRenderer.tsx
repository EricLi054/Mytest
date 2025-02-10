import ContentfulButton from '@/components/ServerComponents/ContentfulButton/ContentfulButton';
import ContentfulGALink from '@/components/ServerComponents/ContentfulGALink';
import ContentfulLink from '@/components/ServerComponents/ContentfulLink';
import { type Links, type RichTextProps } from '@/types/cmsTypes/RichTextProps';
import createEntryMap from '@/utilities/richText/createEntryMap';
import renderEmbeddedEntry from '@/utilities/richText/renderEmbeddedEntry';
import { baseOptions } from '@/utilities/richText/richTextBaseOptions';
import { documentToReactComponents, type Options } from '@contentful/rich-text-react-renderer';
import { INLINES } from '@contentful/rich-text-types';

const componentMap: Record<string, any> = {
  Link: ContentfulLink,
  Button: ContentfulButton
};

function renderOptions(links?: Links): Options {
  const entryMap = createEntryMap(links);

  return {
    renderNode: {
      ...baseOptions,
      [INLINES.EMBEDDED_ENTRY]: (node: any) => {
        return renderEmbeddedEntry(node, entryMap, componentMap);
      },
      [INLINES.ENTRY_HYPERLINK]: (node: any) => {
        return <ContentfulGALink data={node.data.target} />;
      }
    }
  };
}

const BaseRichTextRenderer = ({ richText }: { richText: RichTextProps }) => (
  <>{documentToReactComponents(richText?.json, renderOptions(richText?.links))}</>
);

export default BaseRichTextRenderer;
