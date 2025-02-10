'use client';
import { Grid, styled } from '@mui/material';

export const CardRequestFooterItem = styled(Grid)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '50%'
  }
}));

export const CardRequestFooter = styled(Grid)(({ theme }) => ({
  flexWrap: 'nowrap',
  flexDirection: 'column',
  gap: theme.spacing(3),

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: theme.spacing(4)
  }
}));
