'use client';

import { Grid, styled } from '@mui/material';
import { FooterSiteMap } from '@racwa/react-components';

export const StyledFooterSiteMap = styled(FooterSiteMap)(({ theme }) => ({
  h3: {
    fontSize: 14
  },
  ul: {
    a: {
      fontSize: 12,
      paddingTop: 0
    }
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(7)
  },
  [theme.breakpoints.up('md')]: {
    h3: {
      fontSize: 20
    },
    ul: {
      a: {
        fontSize: 18,
        paddingTop: theme.spacing(1)
      }
    }
  }
}));

export const StyledFooterDescription = styled(Grid)(() => ({
  '& p': {
    fontSize: '12px'
  }
}));
