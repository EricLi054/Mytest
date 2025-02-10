'use client';
import { Button, Typography } from '@mui/material';
import { colors } from '@racwa/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logEvent } from '@/utilities/analyticsTagging';
import { GenericErrorComponent } from './GenericErrorComponent';

const GenericErrorPage = () => {
  return (
    <GenericErrorComponent>
      <Typography color={colors.dieselDeeper} variant='body1'>
        We {"couldn't"} complete your request online. Please call us.
      </Typography>
      <Button
        variant='contained'
        color='primary'
        href='tel:131703'
        size='medium'
        sx={{ letterSpacing: -1 }}
        onClick={() => {
          logEvent('Something went wrong page - Call Us');
        }}
      >
        <FontAwesomeIcon icon='phone' style={{ marginRight: 10 }} fontSize={25} />
        13 17 03
      </Button>
    </GenericErrorComponent>
  );
};

export default GenericErrorPage;
