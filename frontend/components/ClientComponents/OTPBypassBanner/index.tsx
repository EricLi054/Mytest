import { Grid, Typography } from '@mui/material';
import { colors } from '@racwa/styles';
import FontAwesomeIcon from '../FontAwesomeIcon';
import getFeatureToggles from '@/graphql/getFeatureToggles';

const featureToggleKey = 'myRAC_Feature_BypassOtp';

const OTPBypassBanner = async () => {
  const toggles = await getFeatureToggles();

  if (toggles?.find((ft) => ft.key === featureToggleKey)?.enabled) {
    return (
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        width='100%'
        height={50}
        sx={{ backgroundColor: colors.dieselDeep }}
      >
        <Typography variant='h4' color='white'>
          <FontAwesomeIcon icon='phone' style={{ marginRight: 8 }} /> OTP Bypass Enabled - Verification Code: 000000
        </Typography>
      </Grid>
    );
  } else {
    return null;
  }
};

export default OTPBypassBanner;
