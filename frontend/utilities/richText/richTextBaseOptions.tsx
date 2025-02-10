import { StyledLink } from '@/components/StyledComponents/Link.styled';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { Typography } from '@mui/material';

export const baseOptions = {
  [BLOCKS.HEADING_1]: (node: any, children: any) => (
    <Typography variant='h1' color='inherit'>
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_2]: (node: any, children: any) => (
    <Typography variant='h2' color='inherit'>
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_3]: (node: any, children: any) => (
    <Typography variant='h3' color='inherit'>
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_4]: (node: any, children: any) => (
    <Typography variant='h4' color='inherit'>
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_5]: (node: any, children: any) => (
    <Typography variant='h5' color='inherit'>
      {children}
    </Typography>
  ),
  [BLOCKS.HEADING_6]: (node: any, children: any) => (
    <Typography variant='h6' color='inherit'>
      {children}
    </Typography>
  ),
  // Renders typography embedded hyperlink
  [INLINES.HYPERLINK]: (node: any, children: any) => <StyledLink href={node?.data?.uri ?? ''}>{children}</StyledLink>,
  [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
    <Typography variant='body1' color='inherit'>
      {children}
    </Typography>
  )
};
