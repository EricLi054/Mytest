import { render } from '@testing-library/react';
import TopNavBar, { createBreadcrumbs } from '@/components/ServerComponents/TopNavBar';
import { createTheme, ThemeProvider, Typography } from '@mui/material';
import { themeOptions, RacwaResponsiveHeader } from '@racwa/react-components';
import { type LinkProps } from '@/types/cmsTypes/LinkProps';
import { useSession } from 'next-auth/react';
import { getComponent } from '@/graphql/getComponent';
import { topNavProps } from '@/__tests__/mockData/megaNav';
import Link from 'next/link';

jest.mock('../../utilities/getAccessToken', () => jest.fn());
jest.mock('../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));
jest.mock('@racwa/react-components');

const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: 'test-email@test.com' }
};
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('TopNavBar', () => {
  test('creates breadcrumb elements correctly', () => {
    const breadcrumbs: LinkProps[] = [
      {
        longLinkText: 'Home',
        shortLinkText: 'Home',
        linkUrl: '/'
      }
    ];

    const expectedBreadcrumbs = [
      <Typography key='Home'>
        <Link href='/'>Home</Link>
      </Typography>,
      <Typography key='myRAC'>myRAC</Typography>
    ];

    const result = createBreadcrumbs('myRAC', breadcrumbs);
    expect(result).toEqual(expectedBreadcrumbs);
  });
  test('should render the correct TopNavBar structures', async () => {
    jest.mocked(useSession).mockReturnValue({ data: mockSession, status: 'authenticated', update: jest.fn() });

    const expected = [
      {
        title: 'Section 1',
        subTitle: 'Subtitle 1',
        columns: [
          {
            type: 'links',
            items: [
              { text: 'Link 1', link: '/link1' },
              { text: 'Link 2', link: '/link2' }
            ]
          },
          {
            type: 'links',
            items: [{ text: 'Link 3', link: '/link3' }]
          },
          {
            type: 'articles',
            moreInfoLink: '/more-info',
            items: [
              {
                text: 'Article 1',
                image: { src: 'https://example.com/image1.jpg', alt: 'Image 1' },
                link: '/article1'
              },
              { text: 'Article 2', image: { src: 'https://example.com/image2.jpg', alt: 'Image 2' }, link: '/article2' }
            ]
          }
        ]
      },
      {
        title: 'Section 2',
        subTitle: 'Subtitle 2',
        columns: [
          {
            type: 'links',
            items: [{ text: 'Link 4', link: '/link4' }]
          },
          {
            type: 'links',
            items: [{ text: 'Link 5', link: '/link5' }]
          },
          {
            type: 'articles',
            moreInfoLink: '/more-info',
            items: [
              { text: 'Article 3', image: { src: 'https://example.com/image3.jpg', alt: 'Image 3' }, link: '/article3' }
            ]
          }
        ]
      }
    ];

    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(topNavProps));

    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await TopNavBar({
          data: { sys: { id: '1' } },
          title: 'myRAC'
        })}
      </ThemeProvider>
    );
    expect(RacwaResponsiveHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        breadcrumbs: undefined,
        megaNavData: expected,
        stickyDesktopHeader: false,
        logoImage: { src: 'https://rac.com.au/assets/img/RAC-site-logo.png?v=45324', alt: 'logo' }
      }),
      {}
    );
  });
});
