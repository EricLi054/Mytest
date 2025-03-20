import type { z } from "zod";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { clientEnv } from "#env/client";

import type { YourVehicleFormProps } from "./form";
import type { YourVehicleContentfulSchema } from "./schema";
import { getMyRacUrl } from "../../routing";
import { yourVehicle } from "./actions";
import YourVehicleForm from "./form";

export type YourVehiclePageProps = {
  formValues?: YourVehicleFormProps["defaultValues"];
  contentfulData: z.infer<typeof YourVehicleContentfulSchema>;
};

export const YourVehicleContainer: React.FC<YourVehiclePageProps> = ({ formValues, contentfulData }) => {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid size={12}>
        <Typography variant="h3">{contentfulData.heading}</Typography>
      </Grid>
      {contentfulData.subheading && (
        <Grid size={12}>
          <Typography>{contentfulData.subheading}</Typography>
        </Grid>
      )}
      <Grid size={12}>
        <YourVehicleForm
          defaultValues={formValues}
          yourVehicleAction={yourVehicle}
          myRacUrl={getMyRacUrl(clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE_URL)}
          contentfulData={contentfulData}
        />
      </Grid>
    </Grid>
  );
};
