'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button, ClickAwayListener, Grid, Grow, Popper, Typography } from '@mui/material';
import { useState, useRef, type PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { type LinkProps } from '@/types/cmsTypes/LinkProps';
import { type UserMenuProps } from '@/types/cmsTypes/UserMenuProps';
import { useRouter } from 'next/navigation';
import {
  StyledDropdownButton,
  StyledLogoutButton,
  StyledMenuFooter,
  StyledMenuLink,
  StyledMenuList,
  StyledMenuTitle,
  StyledPaper
} from '../StyledComponents/LoginButton.styled';
import { getADB2CLogoutUrl } from '@/utilities/adb2c';
import { logNavClick } from '@/utilities/analyticsTagging';

export const getTitleLink = (links: LinkProps[]) => {
  const firstLink = links?.slice(0, 1)[0];

  return (
    <StyledMenuTitle
      href={firstLink.linkUrl}
      onClick={() => {
        if (firstLink.googleAnalyticsDescription) {
          logNavClick(firstLink.googleAnalyticsDescription);
        }
      }}
    >
      {firstLink.longLinkText}
    </StyledMenuTitle>
  );
};

export const getMenuLinks = (links: LinkProps[]) => {
  return links.slice(1).map((item: LinkProps) => {
    return (
      <StyledMenuLink
        key={item.linkUrl}
        href={item.linkUrl}
        onClick={() => {
          if (item.googleAnalyticsDescription) {
            logNavClick(item.googleAnalyticsDescription);
          }
        }}
      >
        {item.longLinkText}
      </StyledMenuLink>
    );
  });
};

const LoginButton = ({ children, userMenu }: PropsWithChildren<{ userMenu: UserMenuProps }>) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<any>(null);
  const router = useRouter();

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current?.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const logOutLocalAndSession = async () => {
    const logoutUrl = await getADB2CLogoutUrl(window.location.origin);
    await signOut();
    router.push(logoutUrl);
  };

  if (session !== null) {
    return (
      <>
        <StyledDropdownButton
          color='secondary'
          size='small'
          aria-controls={open ? 'user-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='menu'
          onClick={() => {
            setOpen((prevOpen) => !prevOpen);
            logNavClick('myRAC - First name dropdown');
          }}
          aria-label='user-menu-toggle'
          ref={anchorRef}
        >
          <FontAwesomeIcon icon={faUser} />
          <Typography variant='body1' fontSize={14} fontWeight={400} marginX={'.3em'}>
            <>{children}</>
          </Typography>
          <FontAwesomeIcon icon={faCaretDown} />
        </StyledDropdownButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          placement='bottom-end'
          sx={{ zIndex: 10 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <StyledPaper>
                <ClickAwayListener onClickAway={handleClose}>
                  <StyledMenuList id='user-menu'>
                    {userMenu.menuItems?.items?.length > 0 && getTitleLink(userMenu.menuItems?.items)}
                    <Grid container direction='column'>
                      {userMenu.menuItems?.items?.length > 1 && getMenuLinks(userMenu.menuItems?.items)}
                      <StyledMenuFooter>
                        <StyledLogoutButton
                          color='primary'
                          size='small'
                          fullWidth
                          onClick={async () => {
                            logNavClick('myRAC - Log out');
                            await logOutLocalAndSession();
                          }}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} style={{ paddingRight: '0.3em' }} />
                          Log out
                        </StyledLogoutButton>
                      </StyledMenuFooter>
                    </Grid>
                  </StyledMenuList>
                </ClickAwayListener>
              </StyledPaper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
  return (
    <Button
      color='primary'
      size='small'
      onClick={async () => {
        await signIn();
      }}
    >
      <FontAwesomeIcon icon={faUser} style={{ paddingRight: '0.3em' }} />
      Log in
    </Button>
  );
};

export default LoginButton;
