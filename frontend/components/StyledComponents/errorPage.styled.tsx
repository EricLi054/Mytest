'use client';
import { Grid, Typography, styled } from '@mui/material';
import { colors } from '@racwa/styles';
import FontAwesomeIcon from '../ClientComponents/FontAwesomeIcon';

export const StyledBannerGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  minHeight: '8.25rem',
  padding: '3rem 1rem 3rem 1rem',
  [theme.breakpoints.up('sm')]: {
    minHeight: '13.125rem',
    padding: '4.5rem 1.5rem 4.5rem 1.5rem'
  },
  display: 'flex',
  flexGrow: 0,
  alignItems: 'center',
  justifyContent: 'center'
}));

export const StyledContentWrapperGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.common.white,
  padding: '2rem 1rem',
  [theme.breakpoints.up('sm')]: {
    padding: '4rem 1.5rem'
  }
}));

export const StyledExpandingSpacerGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  minHeight: '2rem',
  padding: `${theme.spacing(6.5)} 0`,
  gap: theme.spacing(6.5),
  [theme.breakpoints.up('md')]: {
    padding: `${theme.spacing(13)} ${theme.spacing(2)}`,
    minHeight: '4rem',
    gap: theme.spacing(13)
  }
}));

export const StyledSectionGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(5),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(6.5)
  }
}));

export const StyledSectionHeading = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: colors.dieselDeep,
  fontWeight: 600,
  fontSize: 26,
  [theme.breakpoints.up('md')]: {
    fontSize: 40
  }
}));

export const StyledIcon = styled(FontAwesomeIcon)(({ theme }) => ({
  fontSize: 26,
  [theme.breakpoints.up('md')]: {
    fontSize: 40
  }
}));
