import { type ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import { getComponent } from '@/graphql/getComponent';
import { GALink } from '../ClientComponents/GALink';

interface LinkComponentProps extends ComponentSwitchableProps {}

const fields = `
  __typename
  longLinkText
  linkUrl
  googleAnalyticsDescription
`;

const ContentfulGALink = async ({ data }: LinkComponentProps) => {
  try {
    const componentData = await getComponent('link', data.sys.id, fields, true);

    return (
      <GALink
        longLinkText={componentData.longLinkText}
        href={componentData.linkUrl}
        googleAnalyticsDescription={componentData.googleAnalyticsDescription}
      />
    );
  } catch (error) {
    console.error('Error: ContentfulGALink.tsx -', error);
  }
};

export default ContentfulGALink;
