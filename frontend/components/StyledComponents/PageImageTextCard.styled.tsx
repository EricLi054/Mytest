'use client';

import { Grid, styled } from '@mui/material';
import { colors } from '@racwa/styles';

export const CardContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: colors.white,
  padding: theme.spacing(3),
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row'
  }
}));

export const CardImageSection = styled(Grid)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  padding: `0 ${theme.spacing(3)}`
}));

export const DesktopOnlyCardImageSection = styled(CardImageSection)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

export const MobileOnlyCardImageSection = styled(CardImageSection)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'none'
  }
}));

export const CardImageWrapper = styled(Grid)(() => ({
  height: 'fit-content',
  aspectRatio: '48/85',
  position: 'relative',
  width: '72px'
}));

export const CardContentSection = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(3),
  flexDirection: 'column',
  textAlign: 'center',
  [theme.breakpoints.up('sm')]: {
    textAlign: 'left',
    gap: theme.spacing(1)
  }
}));

export const ContentSection = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(1),
  flexDirection: 'column'
}));
