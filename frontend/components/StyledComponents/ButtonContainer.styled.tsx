'use client';

import { type Breakpoint, Grid, styled } from '@mui/material';
import { colors } from '@racwa/styles';

export const StyledButtonContainer = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'stackTogether' && prop !== 'columnBreakpoint'
})<{
  stackTogether: boolean;
  columnBreakpoint: Breakpoint;
}>(({ stackTogether, columnBreakpoint, theme }) => ({
  width: '100%',
  ...(stackTogether && {
    [theme.breakpoints.down(columnBreakpoint)]: {
      border: `1px solid ${colors.racGray}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: colors.white,
      gap: 0,
      padding: `${theme.spacing(1.5)} 0`,
      '& a': {
        border: 0,
        padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`
      }
    }
  })
}));
