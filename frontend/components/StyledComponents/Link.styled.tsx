'use client';

import { type LinkProps as MUILinkProps, styled } from '@mui/material';
import { colors } from '@racwa/styles';
import Link, { type LinkProps as NextLinkProps } from 'next/link';

const InternalStyledLink = styled(Link)(({ theme }) => ({
  ...(theme.components?.MuiLink?.styleOverrides?.root as object),
  color: colors.linkBlue,
  cursor: 'pointer',
  outline: 'none'
}));

export type StyledLinkProps = Pick<NextLinkProps, 'href'> & Omit<MUILinkProps, 'color' | 'href'>;

export const StyledLink = ({ children, ...props }: StyledLinkProps) => {
  return <InternalStyledLink {...props}>{children}</InternalStyledLink>;
};
