import ContentfulRichTextRenderer from '../ContentfulRichTextRenderer';
import { type BannerProps } from '@/types/cmsTypes/BannerProps';
import { type ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import { getComponent } from '@/graphql/getComponent';
import InternalBanner from './InternalBanner';

const fields = `
  heading {
    json
    links {
      entries {
        inline {
          __typename
          sys {
            id
          }
        }
      }
    }
  }
  bannerImage
  links:bannerLinksCollection(limit: 4) {
    items {
      __typename
      longText
      shortText
      icon
      link
    }
  }
`;

async function Banner({ data }: ComponentSwitchableProps) {
  const banner: BannerProps = await getComponent('banner', data.sys.id, fields, true);

  if (!banner) return null;

  return (
    <InternalBanner
      bannerImage={banner.bannerImage ? banner.bannerImage[0]?.secure_url : ''}
      bannerText={<ContentfulRichTextRenderer text={banner.heading} />}
      topTasks={banner.links?.items}
    />
  );
}

export default Banner;
