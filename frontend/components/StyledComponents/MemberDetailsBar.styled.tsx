'use client';
import { Grid, styled } from '@mui/material';
import { colors } from '@racwa/styles';

export const StyledBackgroundContainer = styled(Grid)(({ theme }) => ({
  margin: '0 0 -52px 0',
  transform: 'translate(0, -52px)',
  backgroundColor: colors.dieselDeepest,
  width: '100%',
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  [theme.breakpoints.up('md')]: {
    width: theme.spacing(120), // 960px
    padding: `${theme.spacing(5)} ${theme.spacing(3)}`,
    borderRadius: 4
  }
}));
