import getStatusInformation from '@/graphql/getStatusInformation';
import { Grid, Typography } from '@mui/material';
import { Card, RacwaStandardPageTemplate } from '@racwa/react-components';
import { type StatusInformation } from '@/types/backendTypes/statusInformation';
import { colors } from '@racwa/styles';
import { StyledBox } from '@/components/StyledComponents/Box.styled';
import FontAwesomeIcon from '@/components/ClientComponents/FontAwesomeIcon';

const colorMap: Record<string, string> = {
  HEALTHY: colors.brandSuccess,
  RESPONDING: colors.racYellow,
  DEGRADED: colors.brandWarning,
  UNABLE_TO_VERIFY: colors.brandWarning,
  DOWN: colors.brandDanger
};

const StatusCard = ({ data }: { data: StatusInformation }) => {
  return (
    <Card
      background='white'
      sx={{
        margin: 0,
        padding: { xs: 4, md: 6 },
        bgcolor: 'white'
      }}
    >
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        gap={2}
        height={100}
        flexWrap='nowrap'
      >
        <Typography variant='h3'>
          <strong>{data.name}</strong>
        </Typography>
        <StyledBox sx={{ bgcolor: colorMap[data.status as string] }}>
          <Typography variant='h4' color='white'>
            {data.status.charAt(0).toLocaleUpperCase() +
              data.status.substring(1).replaceAll('_', ' ').toLocaleLowerCase()}
          </Typography>
        </StyledBox>
      </Grid>
    </Card>
  );
};

const myRACStatus = async () => {
  const statusInformation = await getStatusInformation();

  return (
    <div style={{ height: '100dvh' }}>
      <RacwaStandardPageTemplate heading='myRAC Status' breakpoint='md'>
        <Grid container spacing={2}>
          {!statusInformation && (
            <Typography variant='h2' textAlign='center' width='100%'>
              <FontAwesomeIcon icon='warning' style={{ marginRight: 8 }} />
              Unable to check system status
            </Typography>
          )}
          {statusInformation?.map((data) => {
            return (
              <Grid item key={data.name} xs={12} md={3}>
                <StatusCard data={data} />
              </Grid>
            );
          })}
        </Grid>
      </RacwaStandardPageTemplate>
    </div>
  );
};

export default myRACStatus;
