import { Stack, Typography } from '@mui/material';
import { type MegaNavMenu, type MegaNavMenuColumn, RacwaLink } from '@racwa/react-components';
import LoginButton from '../ClientComponents/LoginButton';
import FontAwesomeIcon from '../ClientComponents/FontAwesomeIcon';
import HeaderSearchBar from '../ClientComponents/HeaderSearchBar';
import { type MegaNavSection, type TopNavigationProps } from '@/types/cmsTypes/TopNavigationProps';
import { type LinkProps } from '@/types/cmsTypes/LinkProps';
import { MapImage } from '@/utilities/cloudinaryImageMapper';
import Mustache from './Mustache';
import ResponsiveHeader from '../ClientComponents/ResponsiveHeader';
import { getComponent } from '@/graphql/getComponent';
import { type ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import Link from 'next/link';

const fields = `
showBreadcrumbs
  links: linksCollection(limit:6) {
    items {
      __typename
      longLinkText
      shortLinkText
      linkUrl
      googleAnalyticsDescription
    }
  }
  mobileLinks: mobileLinksCollection(limit:6) {
    items {
      __typename
      longLinkText
      shortLinkText
      linkUrl
      googleAnalyticsDescription
    }
  }
  searchBar {
    __typename
    placeholderText
  }
  userMenu {
    __typename
    userMenuText {
      sys {
        id
      }
    }
    userFullName {
      sys {
        id
      }
    }
    menuItems: menuItemsCollection(limit: 8){
      items {
        __typename
        longLinkText
        shortLinkText
        linkUrl
        googleAnalyticsDescription
      }
    }
  }
  megaNavContent {
    logo
    logo_data {
      publicId
      context
    }
    sections: sectionsCollection(limit: 4){
      items {
        __typename
        title
        subtitle
        moreInfoLink
        links: linksCollection(limit: 12){
          items {
            __typename
            longLinkText
            shortLinkText
            linkUrl
            googleAnalyticsDescription
          }
        }
        articles: articlesCollection(limit: 4) {
          items {
            __typename
            longLinkText
            shortLinkText
            linkUrl
            linkImage
            googleAnalyticsDescription
            linkImage_data {
              publicId
              context
            }
          }
        }
      }
    }
  }
`;

const generateMegaNav = (megaNavData?: MegaNavSection[]) => {
  return megaNavData?.map<MegaNavMenu>((megaNavSection: MegaNavSection) => {
    // Split the list of links in half for the 2 columns
    const half = Math.ceil(megaNavSection.links.items.length / 2);
    const column1links: MegaNavMenuColumn = {
      type: 'links',
      items: megaNavSection.links.items.slice(0, half).map((link: LinkProps) => {
        return {
          text: link.longLinkText,
          link: link.linkUrl
        };
      })
    };

    const column2links: MegaNavMenuColumn = {
      type: 'links',
      items: megaNavSection.links.items.slice(half).map((link: LinkProps) => {
        return {
          text: link.longLinkText,
          link: link.linkUrl
        };
      })
    };

    const articles: MegaNavMenuColumn = {
      type: 'articles',
      moreInfoLink: megaNavSection.moreInfoLink,
      items: megaNavSection.articles.items.map((article: LinkProps) => {
        return {
          text: article.longLinkText,
          image: article.linkImage ? MapImage(article.linkImage[0]) : { src: '', alt: '' },
          link: article.linkUrl
        };
      })
    };

    return {
      title: megaNavSection.title,
      subTitle: megaNavSection.subtitle,
      columns: [column1links, column2links, articles]
    };
  });
};

export const createBreadcrumbs = (title: string, breadcrumbs?: LinkProps[]) => {
  const breadcrumbArray: JSX.Element[] = [];
  if (!breadcrumbs || breadcrumbs.length > 0) {
    const linkArray = breadcrumbs?.map((item) => {
      if (item.linkUrl) {
        return (
          <Typography key={item.longLinkText}>
            <Link href={item.linkUrl}>{item.longLinkText}</Link>
          </Typography>
        );
      }
      return <Typography key={item.longLinkText}>{item.longLinkText}</Typography>;
    });

    if (linkArray) breadcrumbArray.push(...linkArray);
  }

  breadcrumbArray.push(<Typography key={title}>{title}</Typography>);
  return breadcrumbArray;
};

interface TopNavComponentProps extends ComponentSwitchableProps {
  title: string;
  breadcrumbs?: LinkProps[];
}

async function TopNavBar({ data, title, breadcrumbs }: TopNavComponentProps) {
  const navigation: TopNavigationProps = await getComponent('topNavBar', data.sys.id, fields, true);

  return (
    <ResponsiveHeader
      navigation={navigation}
      breadcrumbs={navigation.showBreadcrumbs ? createBreadcrumbs(title, breadcrumbs) : undefined}
      megaNavData={generateMegaNav(navigation.megaNavContent?.sections?.items)}
      fullName={<Mustache data={navigation.userMenu?.userFullName} />}
    >
      <Stack direction='row' alignItems='center' gap={4}>
        {navigation.links?.items?.map((item: LinkProps, index: number) => {
          return (
            <RacwaLink key={index} link={item.linkUrl} sx={{ fontSize: 14 }}>
              {item.linkUrl.startsWith('tel:') && (
                <FontAwesomeIcon icon='phone' style={{ marginRight: 1, fontSize: '12px' }} />
              )}
              {item.longLinkText}
            </RacwaLink>
          );
        })}
      </Stack>
      <Stack direction='row' alignItems='center' gap={1} paddingLeft={3}>
        {navigation.searchBar && <HeaderSearchBar placeholder={navigation.searchBar.placeholderText} />}
        <LoginButton userMenu={navigation.userMenu}>
          <Mustache data={navigation.userMenu?.userMenuText} />
        </LoginButton>
      </Stack>
    </ResponsiveHeader>
  );
}

export default TopNavBar;
