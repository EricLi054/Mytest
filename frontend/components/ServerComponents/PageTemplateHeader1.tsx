import { Grid } from '@mui/material';
import React from 'react';
import { HeaderIconWrapper, HeadingSection, IconSection } from '../StyledComponents/PageTemplateHeader.styled';

export interface PageTemplateHeader1Props {
  HeaderIcon: () => JSX.Element;
  HeaderText: () => JSX.Element;
}

export const PageTemplateHeader1: React.FC<PageTemplateHeader1Props> = ({ HeaderIcon, HeaderText }) => {
  return (
    <Grid textAlign='center' direction='column'>
      {/* Header Icon  */}
      <IconSection container>
        <HeaderIconWrapper item>
          <HeaderIcon />
        </HeaderIconWrapper>
      </IconSection>
      {/* Heading and Sub-Heading  */}
      <HeadingSection container>
        <HeaderText />
      </HeadingSection>
    </Grid>
  );
};
