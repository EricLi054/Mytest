import { type MegaNavSection, type TopNavigationProps } from '@/types/cmsTypes/TopNavigationProps';
import { type MegaNavMenu } from '@racwa/react-components';

export const megaNavData: MegaNavSection[] = [
  {
    title: 'Section 1',
    subtitle: 'Subtitle 1',
    links: {
      items: [
        { longLinkText: 'Link 1', shortLinkText: '1', linkUrl: '/link1' },
        { longLinkText: 'Link 2', shortLinkText: '2', linkUrl: '/link2' },
        { longLinkText: 'Link 3', shortLinkText: '3', linkUrl: '/link3' }
      ]
    },
    articles: {
      items: [
        {
          shortLinkText: '1',
          longLinkText: 'Article 1',
          linkUrl: '/article1',
          linkImage: [
            {
              publicId: '/image1.jpg',
              secure_url: 'https://example.com/image1.jpg',
              context: { custom: { alt: 'Image 1' } }
            }
          ]
        },
        {
          shortLinkText: '2',
          longLinkText: 'Article 2',
          linkUrl: '/article2',
          linkImage: [
            {
              publicId: '/image2.jpg',
              secure_url: 'https://example.com/image2.jpg',
              context: { custom: { alt: 'Image 2' } }
            }
          ]
        }
      ]
    },
    moreInfoLink: '/more-info'
  },
  {
    title: 'Section 2',
    subtitle: 'Subtitle 2',
    links: {
      items: [
        { shortLinkText: '4', longLinkText: 'Link 4', linkUrl: '/link4' },
        { shortLinkText: '5', longLinkText: 'Link 5', linkUrl: '/link5' }
      ]
    },
    articles: {
      items: [
        {
          shortLinkText: '3',
          longLinkText: 'Article 3',
          linkUrl: '/article3',
          linkImage: [
            {
              publicId: '/image3.jpg',
              secure_url: 'https://example.com/image3.jpg',
              context: { custom: { alt: 'Image 3' } }
            }
          ]
        }
      ]
    },
    moreInfoLink: '/more-info'
  }
];

export const topNavProps: TopNavigationProps = {
  showBreadcrumbs: false,
  links: {
    items: [
      { longLinkText: 'Link 1', shortLinkText: '1', linkUrl: '/link1' },
      { longLinkText: 'Link 2', shortLinkText: '2', linkUrl: '/link2' },
      { longLinkText: 'Link 3', shortLinkText: '3', linkUrl: '/link3' }
    ]
  },
  mobileLinks: {
    items: [
      { longLinkText: 'Link 1', shortLinkText: '1', linkUrl: '/link1' },
      { longLinkText: 'Link 2', shortLinkText: '2', linkUrl: '/link2' },
      { longLinkText: 'Link 3', shortLinkText: '3', linkUrl: '/link3' }
    ]
  },
  searchBar: {
    placeholderText: 'Search'
  },
  userMenu: {
    userMenuText: { sys: { id: '1' } },
    userFullName: { sys: { id: '1' } },
    menuItems: {
      items: [
        {
          longLinkText: 'User menu Link 1',
          shortLinkText: '1',
          linkUrl: '/link1',
          googleAnalyticsDescription: 'User menu Link 1'
        },
        {
          longLinkText: 'User menu Link 2',
          shortLinkText: '2',
          linkUrl: '/link2',
          googleAnalyticsDescription: 'User menu Link 2'
        },
        {
          longLinkText: 'User menu Link 3',
          shortLinkText: '3',
          linkUrl: '/link3',
          googleAnalyticsDescription: 'User menu Link 3'
        }
      ]
    }
  },
  megaNavContent: {
    logo: [
      {
        secure_url: 'https://rac.com.au/assets/img/RAC-site-logo.png?v=45324',
        publicId: '/logo.jpg',
        context: {
          custom: {
            alt: 'Logo'
          }
        }
      }
    ],
    sections: { items: megaNavData }
  }
};

export const megaNavMenuData: MegaNavMenu[] = [
  {
    title: 'Title 1',
    subTitle: 'Subtitle 1',
    columns: [
      {
        type: 'links',
        items: [
          {
            text: 'Text 1',
            link: '/racwa/one'
          },
          { text: 'Text 2', link: '/racwa/two' },
          {
            text: 'Text 3',
            link: '/racwa/three'
          }
        ]
      }
    ]
  },
  {
    title: 'Title 2',
    subTitle: 'Subtitle 2',
    columns: [
      {
        type: 'links',
        items: [
          {
            text: 'Text 4',
            link: '/racwa/four'
          },
          { text: 'Text 5', link: '/racwa/five' },
          {
            text: 'Text 6',
            link: '/racwa/six'
          }
        ]
      }
    ]
  },
  {
    title: 'Title 3',
    subTitle: 'Subtitle 3',
    columns: [
      {
        type: 'links',
        items: [
          {
            text: 'Text 7',
            link: '/racwa/seven'
          },
          { text: 'Text 8', link: '/racwa/eight' },
          {
            text: 'Text 9',
            link: '/racwa/nine'
          }
        ]
      }
    ]
  },
  {
    title: 'Title 4',
    subTitle: 'Subtitle 4',
    columns: [
      {
        type: 'links',
        items: [
          {
            text: 'Text 10',
            link: '/racwa/ten'
          },
          { text: 'Text 11', link: '/racwa/eleven' },
          {
            text: 'Text 12',
            link: '/racwa/twelve'
          }
        ]
      }
    ]
  }
];
