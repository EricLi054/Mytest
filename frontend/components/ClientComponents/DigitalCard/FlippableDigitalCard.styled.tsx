'use client';
import { Box, styled } from '@mui/material';

export const StyledCard = styled(Box)(({ theme }) => ({
  width: '343px',
  [theme.breakpoints.up('md')]: {
    width: '256px'
  },
  height: 'auto',
  aspectRatio: '86 / 54',
  backgroundColor: 'transparent',
  borderRadius: '8px',
  perspective: '1000px'
}));

export const StyledCardInner = styled(Box, { shouldForwardProp: (prop) => prop !== 'showBarcode' })<{
  showBarcode: boolean;
}>(({ showBarcode }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.8s',
  transformStyle: 'preserve-3d',
  transform: showBarcode ? 'rotateY(180deg)' : 'rotateY(0deg)'
}));

export const CardSide = styled(Box)({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  WebkitBackfaceVisibility: 'hidden',
  backfaceVisibility: 'hidden',
  borderRadius: '8px'
});
export const StyledCardFront = styled(CardSide)({});

export const StyledCardBack = styled(CardSide)({
  transform: 'rotateY(180deg)'
});
