'use client';

import {
  Button,
  ClickAwayListener,
  Grid,
  Grow,
  MenuList,
  Paper,
  Popper,
  type SxProps,
  type Theme,
  styled
} from '@mui/material';
import { useState, useRef, useCallback, type PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@racwa/styles';
import { BodyCopy } from '@racwa/react-components';
import { type GAProps } from '@/types/cmsTypes/GAProps';
import { logEvent } from '@/utilities/analyticsTagging';
import Link from 'next/link';

interface DropdownLink {
  label: string;
  subLabel?: string;
  link: string;
  analytics?: GAProps;
}

export interface DropdownButtonProps extends PropsWithChildren {
  menuItems: DropdownLink[];
  sx?: SxProps<Theme>;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  /* Use for analytics event on button click */
  primaryLabel: string;
}

const StyledButton = styled(Button)(() => ({
  padding: '10px 30px',
  height: '3rem',
  fontSize: 18
}));

const StyledPaper = styled(Paper)(() => ({
  backgroundColor: 'white',
  minWidth: 160
}));

const StyledDropdownLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: colors.dieselDeeper,
  fontSize: 18,
  fontWeight: 400,
  padding: '3px 20px',
  '&:hover': {
    backgroundColor: colors.racGrayLight
  }
}));

function DropdownButton({ children, menuItems, sx, primaryLabel, color }: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<any>(null);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
    logEvent(`Click - ${primaryLabel}`);
  }, [setOpen, primaryLabel]);

  const handleClose = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (anchorRef.current?.contains(event.target)) {
        return;
      }
      setOpen(false);
    },
    [anchorRef, setOpen]
  );

  return (
    <>
      <StyledButton
        color={color}
        size='small'
        aria-controls={open ? 'menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='menu'
        onClick={handleToggle}
        aria-label='user-menu-toggle'
        ref={anchorRef}
        sx={sx}
      >
        {children}
        <FontAwesomeIcon size='sm' icon={faAngleDown} style={{ marginLeft: 20 }} />
      </StyledButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement='bottom-start'
        sx={{ zIndex: 10 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <StyledPaper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='menu'>
                  <Grid container direction='column'>
                    {menuItems.map((menuItem: DropdownLink) => {
                      return (
                        <StyledDropdownLink
                          key={menuItem.label}
                          href={menuItem.link}
                          onClick={() => {
                            logEvent(menuItem.analytics?.description ?? '');
                          }}
                        >
                          <BodyCopy fontWeight={menuItem.subLabel ? 'light' : 'medium'}>{menuItem.label}</BodyCopy>
                          {menuItem.subLabel && <BodyCopy fontWeight={'medium'}>{menuItem.subLabel}</BodyCopy>}
                        </StyledDropdownLink>
                      );
                    })}
                  </Grid>
                </MenuList>
              </ClickAwayListener>
            </StyledPaper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default DropdownButton;
