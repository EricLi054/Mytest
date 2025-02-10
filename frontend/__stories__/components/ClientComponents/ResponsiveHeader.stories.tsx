import { megaNavMenuData, topNavProps } from '@/__tests__/mockData/megaNav';
import FontAwesomeIcon from '@/components/ClientComponents/FontAwesomeIcon';
import HeaderSearchBar from '@/components/ClientComponents/HeaderSearchBar';
import LoginButton from '@/components/ClientComponents/LoginButton';
import ResponsiveHeader from '@/components/ClientComponents/ResponsiveHeader';
import { Stack, Typography } from '@mui/material';
import { RacwaLink } from '@racwa/react-components';
import { type Meta } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';

const meta: Meta<typeof ResponsiveHeader> = {
  title: 'Components/Client Components/Responsive Header',
  component: ResponsiveHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SessionProvider>
        <Story />
      </SessionProvider>
    )
  ]
};
export default meta;

const noMegaNavProps = {
  ...topNavProps,
  megaNavContent: undefined
};

export const Default = () => {
  return <ResponsiveHeader navigation={topNavProps} megaNavData={megaNavMenuData} fullName={'Joe Bloggs'} />;
};
Default.play = async () => {
  const firstSection = screen.getByText('Title 1');
  await userEvent.click(firstSection);
};

export const NoMegaNav = () => {
  return <ResponsiveHeader navigation={noMegaNavProps} megaNavData={undefined} fullName={'Joe Bloggs'} />;
};

export const WithBreadcrumbs = () => {
  return (
    <ResponsiveHeader
      navigation={noMegaNavProps}
      megaNavData={undefined}
      fullName={'Joe Bloggs'}
      breadcrumbs={[
        <Typography key='/myrac'>
          <Link href='#'>myRAC</Link>
        </Typography>,
        <Typography key='/page'>Page Name</Typography>
      ]}
    />
  );
};

export const WithChildren = () => {
  return (
    <ResponsiveHeader navigation={noMegaNavProps} megaNavData={undefined} fullName={'Joe Bloggs'}>
      <Stack direction='row' alignItems='center' gap={4}>
        <RacwaLink link='#' sx={{ fontSize: 14 }}>
          Link 1
        </RacwaLink>
        <RacwaLink link='#' sx={{ fontSize: 14 }}>
          Link 2
        </RacwaLink>
        <RacwaLink link='#' sx={{ fontSize: 14 }}>
          <FontAwesomeIcon icon='phone' style={{ marginRight: 1, fontSize: '12px' }} />
          Phone Link
        </RacwaLink>
      </Stack>
      <Stack direction='row' alignItems='center' gap={1} paddingLeft={3}>
        <HeaderSearchBar placeholder='Search...' />
        <LoginButton
          userMenu={{
            userMenuText: { sys: { id: '1' } },
            userFullName: { sys: { id: '1' } },
            menuItems: {
              items: [
                { longLinkText: 'Link 1', shortLinkText: '1', linkUrl: '/link1' },
                { longLinkText: 'Link 2', shortLinkText: '2', linkUrl: '/link2' },
                { longLinkText: 'Link 3', shortLinkText: '3', linkUrl: '/link3' }
              ]
            }
          }}
        >
          Joe
        </LoginButton>
      </Stack>
    </ResponsiveHeader>
  );
};
