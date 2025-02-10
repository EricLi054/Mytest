import { type ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import { getComponent } from '@/graphql/getComponent';
import { ReturnLink } from '../ClientComponents/ReturnLink';

interface LinkComponentProps extends ComponentSwitchableProps {}

const fields = `
  __typename
  longLinkText
  linkUrl
`;

const ContentfulLink = async ({ data }: LinkComponentProps) => {
  try {
    const componentData = await getComponent('link', data.sys.id, fields, true);

    return <ReturnLink longLinkText={componentData.longLinkText} linkUrl={componentData.linkUrl} />;
  } catch (error) {
    console.error('Error: ContentfulLink.tsx -', error);
  }
};

export default ContentfulLink;
