import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import type { UpdateVehicleFormProps } from "./form";
import { getVehicleByRego, updateVehicle } from "./actions";
import UpdateVehicleForm from "./form";

export type UpdateVehicleContainerProps = {
  contentfulData: UpdateVehicleFormProps["contentfulData"];
  formValues?: UpdateVehicleFormProps["defaultValues"];
};

export default function UpdateVehicleContainer({ contentfulData, formValues }: UpdateVehicleContainerProps) {
  return (
    <Grid container direction={"column"} spacing={2}>
      <Grid size={12}>
        <Typography variant="h3">{contentfulData.heading}</Typography>
      </Grid>
      <Grid size={12}>
        <Typography>{contentfulData.subheading}</Typography>
      </Grid>

      <Grid size={12}>
        <UpdateVehicleForm
          contentfulData={contentfulData}
          updateVehicleAction={updateVehicle}
          getVehicleByRegoAction={getVehicleByRego}
          defaultValues={formValues}
        />
      </Grid>
    </Grid>
  );
}
