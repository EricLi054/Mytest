'use client';

import { logEvent } from '@/utilities/analyticsTagging';
import { Grid, type GridProps, styled } from '@mui/material';
import { colors } from '@racwa/styles';
import { useEffect } from 'react';

interface EventOnDisplayGridProps extends GridProps {
  googleAnalyticsDescription: string;
}

const EventOnDisplayGrid = ({ googleAnalyticsDescription, children, ...props }: EventOnDisplayGridProps) => {
  useEffect(() => {
    logEvent(googleAnalyticsDescription);
  }, [googleAnalyticsDescription]);

  return <Grid {...props}>{children}</Grid>;
};

export const TextCardContainer = styled(EventOnDisplayGrid)(({ theme }) => ({
  padding: theme.spacing(3),
  flexDirection: 'column',
  textAlign: 'left',
  gap: theme.spacing(1),
  backgroundColor: colors.white,
  borderRadius: '4px'
}));

export const TextCardTitle = styled(Grid)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(0.5),
  alignItems: 'center'
}));

export const IconWrapper = styled(Grid)(() => ({
  width: '20px',
  color: colors.dieselDeep,
  display: 'flex',
  fontSize: '18px'
}));
