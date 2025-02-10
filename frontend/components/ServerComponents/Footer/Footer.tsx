import ContentfulRichTextRenderer from '../ContentfulRichTextRenderer';
import { type FooterSitemapProps, type FooterProps } from '@/types/cmsTypes/FooterProps';
import { type LinkProps } from '@/types/cmsTypes/LinkProps';
import { getComponent } from '@/graphql/getComponent';
import { type ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import InternalFooter from './InternalFooter';

const fields = `
  searchBar {
    __typename
    placeholderText
  }
  sitemap:sitemapDataCollection(limit:3) {
    items {
      parentLink {
        __typename
        longLinkText
        shortLinkText
        linkUrl
      }
      links:linksCollection(limit:15){
        items {
          __typename
          longLinkText
          shortLinkText
          linkUrl
        }
      }
    }
  }
  endText {
    json
  }
  logo
  logo_data {
    publicId
    context
  }
  links: linksCollection(limit: 6){
    items {
      __typename
      longLinkText
      shortLinkText
      linkUrl
    }
  }
  socialLinks: socialLinksCollection(limit: 6){
    items {
      __typename
      longText
      link
      icon
      logoHoverColour
      variant
    }
  }
`;

const generateSitemap = (sitemapData: FooterSitemapProps[]) => {
  return sitemapData.map((footerSection: FooterSitemapProps) => {
    return {
      title: footerSection.parentLink.longLinkText,
      link: footerSection.parentLink.linkUrl,
      children: footerSection.links.items.map((link: LinkProps) => {
        return {
          title: link.longLinkText,
          link: link.linkUrl
        };
      })
    };
  });
};

async function Footer({ data }: ComponentSwitchableProps) {
  const footer: FooterProps = await getComponent('footer', data.sys.id, fields, true);

  if (!footer) return null;

  return (
    <InternalFooter
      logo={footer.logo?.length > 0 ? footer.logo[0]?.secure_url : ''}
      searchPlaceholderText={footer.searchBar?.placeholderText}
      sitemapData={generateSitemap(footer.sitemap?.items)}
      links={footer.links?.items}
      socialLinks={footer.socialLinks?.items}
      footerDescription={<ContentfulRichTextRenderer text={footer.endText} />}
    />
  );
}

export default Footer;
