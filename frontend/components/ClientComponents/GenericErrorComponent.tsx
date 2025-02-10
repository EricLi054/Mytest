'use client';
import { Grid, styled, Typography } from '@mui/material';
import { RacwaStandardPageTemplate } from '@racwa/react-components';
import { colors } from '@racwa/styles';
import { type PropsWithChildren } from 'react';

export interface GenericErrorComponentProps extends PropsWithChildren {
  heading?: string;
  subHeading?: string;
}

const StyledRacwaStandardPageTemplate = styled(RacwaStandardPageTemplate)(({ theme }) => ({
  h1: {
    maxWidth: 800
  }
}));

const StyledChildrenContainer = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  a: {
    marginTop: theme.spacing(1)
  },
  [theme.breakpoints.up('md')]: {
    alignItems: 'center'
  }
}));

export const GenericErrorComponent: React.FC<GenericErrorComponentProps> = ({
  children,
  heading = 'Uh oh!',
  subHeading = 'Something went wrong'
}) => {
  return (
    <div style={{ height: '100dvh' }}>
      <StyledRacwaStandardPageTemplate heading={heading} breakpoint='md'>
        <Grid container justifyContent='center' alignItems='center' direction='column' bgcolor='white'>
          <Grid textAlign={{ xs: 'unset', md: 'center' }} width='100%' maxWidth={520}>
            <Typography variant='h2' color={colors.dieselDeep} sx={{ mb: 2 }}>
              {subHeading}
            </Typography>
            <StyledChildrenContainer>{children}</StyledChildrenContainer>
          </Grid>
        </Grid>
      </StyledRacwaStandardPageTemplate>
    </div>
  );
};
