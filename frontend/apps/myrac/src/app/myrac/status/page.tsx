import type { z } from "zod";
import { Grid2 as Grid, Typography } from "@mui/material";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";

import { Card, RacwaStandardPageTemplate } from "@racwa/react-components";
import { colors } from "@racwa/styles";

import type { StatusSchema } from "./data";
import { getStatusInformation } from "./data";
import { StyledBox } from "./styled";

const colorMap: Record<string, string> = {
  HEALTHY: colors.brandSuccess,
  RESPONDING: colors.racYellow,
  DEGRADED: colors.brandWarning,
  UNABLE_TO_VERIFY: colors.brandWarning,
  DOWN: colors.brandDanger,
};

const StatusCard = ({ data }: { data: z.infer<typeof StatusSchema> }) => {
  return (
    <Card
      background="white"
      sx={{
        margin: 0,
        padding: { xs: 4, md: 6 },
        bgcolor: "white",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        height={100}
        flexWrap="nowrap"
      >
        <Typography variant="h3">
          <strong>{data.name}</strong>
        </Typography>
        <StyledBox sx={{ bgcolor: colorMap[data.status as string] }}>
          <Typography variant="h4" color="white">
            {data.status.charAt(0).toLocaleUpperCase() +
              data.status.substring(1).replaceAll("_", " ").toLocaleLowerCase()}
          </Typography>
        </StyledBox>
      </Grid>
    </Card>
  );
};

const myRACStatus = async () => {
  const statusInformation = await getStatusInformation();

  return (
    <div style={{ height: "100dvh" }}>
      <RacwaStandardPageTemplate heading="myRAC Status" breakpoint="md">
        <Grid container spacing={2}>
          {!statusInformation && (
            <Typography variant="h2" textAlign="center" width="100%">
              <FontAwesomeIcon icon="warning" style={{ marginRight: 8 }} />
              Unable to check system status
            </Typography>
          )}
          {statusInformation?.map((data) => {
            return (
              <Grid key={data.name} size={{ xs: 12, md: 3 }}>
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
