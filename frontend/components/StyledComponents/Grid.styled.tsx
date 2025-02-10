'use client';

import { Grid, styled } from '@mui/material';
import { colors } from '@racwa/styles';

const StyledGrid = styled(Grid, { shouldForwardProp: (prop) => prop !== 'backgroundColor' })<{
  backgroundColor: string;
}>(({ backgroundColor }) => ({
  backgroundColor: backgroundColor
    ? Object.keys(colors).includes(backgroundColor)
      ? colors[backgroundColor as keyof typeof colors]
      : undefined
    : undefined
}));

export default StyledGrid;
