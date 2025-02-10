'use client';
import { Grid, styled } from '@mui/material';
import { colors } from '@racwa/styles';

export const PageContainerGrid = styled(Grid)(({ theme }) => ({
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(8),
  backgroundColor: colors.subtleBg,
  padding: '2.5rem 1rem 5rem 1rem',
  [theme.breakpoints.up('sm')]: {
    padding: '6.5rem 1rem 8rem 1rem'
  }
}));

export const PageContentGrid = styled(Grid)(() => ({
  flexDirection: 'column',
  textAlign: 'center'
}));
