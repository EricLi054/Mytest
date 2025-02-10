'use client';
import { Button, Grid, styled, useMediaQuery, useTheme } from '@mui/material';
import FontAwesomeIcon from '../ClientComponents/FontAwesomeIcon';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { logEvent } from '@/utilities/analyticsTagging';

export const StyledButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: `0 ${theme.spacing(2)} ${theme.spacing(6)} ${theme.spacing(2)}`,
    gap: theme.spacing(1)
  },
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'column',
    position: 'absolute',
    top: 40,
    right: 0,
    minWidth: 140,
    width: 'auto'
  }
}));

export const StyledBannerTextContainer = styled(Grid)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    paddingBottom: 78,
    width: '75%'
  },
  [theme.breakpoints.up('md')]: {
    width: '100%',
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10)
  }
}));

export const StyledBannerText = styled('div')(({ theme }) => ({
  width: '100%',
  color: 'white',
  textShadow: '0 0 100px rgba(0,0,0,.4), 0 0 12px rgba(0,0,0,.6), 0 1px 2px rgba(0,0,0,.5)',
  [theme.breakpoints.up('md')]: {
    width: 940
  }
}));

const StyledBannerButtonBase = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  height: 'auto',
  gap: theme.spacing(1),
  fontSize: theme.typography.button.fontSize,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: theme.spacing(7),
    minWidth: theme.spacing(9)
  }
}));

interface StyledBannerButtonProps {
  color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  href: string;
  icon: IconProp;
  longText: string;
  shortText: string;
}

export const StyledBannerButton = ({ color, href, icon, longText, shortText }: StyledBannerButtonProps) => {
  const theme = useTheme();
  const mobileQuery = theme.breakpoints.down('sm');
  const isMobile = useMediaQuery(mobileQuery);
  return (
    <StyledBannerButtonBase
      color={color}
      href={href}
      onClick={() => {
        logEvent(`Click - Banner Link - ${longText}`);
      }}
    >
      {icon && <FontAwesomeIcon size='sm' icon={icon} style={{ minWidth: 15 }} />}
      {isMobile ? shortText : longText}
    </StyledBannerButtonBase>
  );
};

// Height here is temporary until there is content to create the height
export const BackgroundImageDiv = styled('div', { shouldForwardProp: (prop) => prop !== 'backgroundImage' })<{
  backgroundImage: string;
}>(({ theme, backgroundImage }) => ({
  padding: 0,
  height: theme.spacing(37),
  width: '100%',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    height: theme.spacing(40)
  }
}));
