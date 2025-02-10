'use client';
import { useMemo, type PropsWithChildren, useState, useEffect } from 'react';
import { type MegaNavMenu, RacwaResponsiveHeader, RacwaLink } from '@racwa/react-components';
import { type TopNavigationProps } from '@/types/cmsTypes/TopNavigationProps';
import HeaderSearchBar from './HeaderSearchBar';
import { Button, Grid, Stack, Typography, styled } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from '@racwa/styles';
import { type LinkProps } from '@/types/cmsTypes/LinkProps';
import CldImage from './CldImage';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getADB2CLogoutUrl } from '@/utilities/adb2c';
import { logNavClick } from '@/utilities/analyticsTagging';

const StyledResponsiveHeader = styled(RacwaResponsiveHeader)(({ theme }) => ({
  // Without zIndex the box shadow is hidden by the banner image
  zIndex: 1,
  // Hide the breadcrumbs and separator on mobile
  '& .MuiBreadcrumbs-li:not(:first-of-type)': {
    display: { xs: 'none', md: 'block' }
  },
  '& .MuiBreadcrumbs-separator': {
    display: { xs: 'none', md: 'block' }
  },
  // TODO: This is not ideal, but adds styling to the mobile top bar so our buttons style correctly
  // don't want to make a change to the design system otherwise it will disturb insurance
  [theme.breakpoints.down('md')]: {
    '& .MuiGrid-container:first-of-type:not(:only-child)': {
      padding: 0,
      '& .MuiGrid-item:first-of-type': {
        height: '100%'
      },
      '& .MuiGrid-item:last-of-type': {
        height: '100%'
      }
    }
  }
}));

const StyledFlexibleContainer = styled(Grid)(() => ({
  backgroundColor: colors.dieselDeepest
}));

const StyledHeaderButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'open'
})<{ open: boolean }>(({ open }) => ({
  padding: 0,
  border: 0,
  borderRadius: 0,
  height: '100%',
  color: open ? colors.white : 'unset',
  backgroundColor: open ? colors.dieselDeepest : 'transparent',
  '&:hover': {
    backgroundColor: open ? colors.dieselDeepest : 'transparent'
  }
}));

const StyledCardContainer = styled('div')(() => ({
  position: 'relative',
  width: '42px',
  aspectRatio: 1
}));

interface ResponsiveHeaderProps {
  navigation: TopNavigationProps;
  breadcrumbs?: JSX.Element[];
  megaNavData?: MegaNavMenu[];
  fullName: React.ReactNode;
}

const ResponsiveHeader = ({
  navigation,
  breadcrumbs,
  megaNavData,
  fullName,
  children
}: PropsWithChildren<ResponsiveHeaderProps>) => {
  const { status } = useSession();
  const router = useRouter();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  // This useEffect is used to fire the window scroll event when the menu is opened
  // This allows Poppers to recalculate their position
  useEffect(() => {
    setTimeout(() => {
      window.scroll({
        top: window.scrollY > 0 ? window.scrollY - 1 : window.scrollY + 1,
        left: 0,
        behavior: 'smooth'
      });
    }, 300);
  }, [mobileUserMenuOpen, mobileSearchOpen]);

  const mobileSearchBar = useMemo(() => {
    return (
      <Grid item padding={1}>
        <HeaderSearchBar placeholder='Search' fullWidth />
      </Grid>
    );
  }, []);

  const racLogoClick = () => {
    if (typeof window === 'undefined') return;
    window.location.assign(window.location.origin);
  };

  const mobileUserMenu = useMemo(() => {
    const sessionButtonOnClick = async () => {
      if (status === 'authenticated') {
        const logoutUrl = await getADB2CLogoutUrl(window.location.origin);
        logNavClick('myRAC - Log out');
        await signOut();
        router.push(logoutUrl);
      } else {
        await signIn('azure-ad-b2c');
      }
    };

    return (
      <Grid container direction='column' paddingBottom={1}>
        <Stack
          direction='column'
          justifyContent='center'
          gap={1.5}
          paddingY={1}
          boxShadow='0 1px 0 rgba(255,255,255,.1)'
          // This color is non-standard in the design system
          sx={{ backgroundColor: '#111f2a' }}
        >
          {status === 'authenticated' && (
            <>
              <Stack direction='row' paddingY={1} paddingX={2} gap={1}>
                <StyledCardContainer>
                  <CldImage
                    data-testid='member-card-yellow-image'
                    fill
                    src='myRAC/member-card-yellow'
                    alt='member-card-yellow'
                    onClick={() => {
                      logNavClick('myRAC - Digital card icon');
                    }}
                  />
                </StyledCardContainer>
                <Typography
                  data-testid='member-full-name-typography'
                  flexGrow={1}
                  sx={{ color: 'white' }}
                  onClick={() => {
                    logNavClick('myRAC - Full name');
                  }}
                >
                  <>{fullName}</>
                </Typography>
              </Stack>
              {navigation?.userMenu.menuItems?.items.map((item: LinkProps, index: number) => {
                return (
                  <RacwaLink
                    key={index}
                    link={item.linkUrl}
                    sx={{ paddingX: 2 }}
                    onClick={() => {
                      if (item.googleAnalyticsDescription) {
                        logNavClick(item.googleAnalyticsDescription);
                      }
                    }}
                  >
                    {item.longLinkText}
                  </RacwaLink>
                );
              })}
            </>
          )}
          <Stack direction='row' paddingY={1} paddingX={2} gap={1}>
            <Button fullWidth color='secondary' href='tel:131703'>
              <FontAwesomeIcon icon='phone' style={{ marginRight: 2, fontSize: '12px' }} />
              13 17 03
            </Button>
            <Button fullWidth color='primary' onClick={sessionButtonOnClick}>
              <FontAwesomeIcon icon='user' style={{ marginRight: 2, fontSize: '12px' }} />
              {status === 'authenticated' ? 'Log out' : 'Log in'}
            </Button>
          </Stack>
        </Stack>
        <Stack direction='column' justifyContent='center' gap={1.5} paddingY={1}>
          {navigation.mobileLinks?.items?.map((item: LinkProps, index: number) => {
            return (
              <RacwaLink key={index} link={item.linkUrl} sx={{ paddingX: 2 }}>
                {item.longLinkText}
              </RacwaLink>
            );
          })}
        </Stack>
      </Grid>
    );
  }, [fullName, navigation.mobileLinks?.items, navigation?.userMenu.menuItems?.items, router, status]);

  return (
    <StyledResponsiveHeader
      enableMobileViewForTabletScreens={true}
      breadcrumbs={breadcrumbs}
      stickyDesktopHeader={false}
      megaNavData={megaNavData}
      logoImage={{
        src: navigation.megaNavContent?.logo ? navigation.megaNavContent.logo[0]?.secure_url : '',
        alt: 'logo'
      }}
      onLogoImageClick={racLogoClick}
      startAction={
        <StyledHeaderButton
          size='small'
          open={mobileSearchOpen}
          data-testid='mobile-search-button'
          onClick={() => {
            setMobileSearchOpen((current) => !current);
          }}
        >
          <Grid container direction='column' height='auto'>
            <FontAwesomeIcon icon='search' />
            <span>Search</span>
          </Grid>
        </StyledHeaderButton>
      }
      endAction={
        <StyledHeaderButton
          size='small'
          open={mobileUserMenuOpen}
          onClick={() => {
            setMobileUserMenuOpen((current) => !current);
            const navAction = !mobileUserMenuOpen ? 'Open' : 'Close';
            logNavClick(`More chevron - ${navAction}`);
          }}
        >
          <Grid container direction='column' height='auto'>
            <FontAwesomeIcon icon={mobileUserMenuOpen ? 'chevron-up' : 'chevron-down'} />
            <span>More</span>
          </Grid>
        </StyledHeaderButton>
      }
      flexibleContainerOpen={mobileSearchOpen || mobileUserMenuOpen}
      flexibleContainerContent={
        <StyledFlexibleContainer container direction='column'>
          {mobileSearchOpen && mobileSearchBar}
          {mobileUserMenuOpen && mobileUserMenu}
        </StyledFlexibleContainer>
      }
    >
      {children}
    </StyledResponsiveHeader>
  );
};

export default ResponsiveHeader;
