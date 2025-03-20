"use client";

import type { VehicleCardInfo } from "#utils/getVehicleCardInfo";
import type { z } from "zod";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { CarGRFX001NoPadding, MotoGRFX016NoPadding, PolicyDetailsCard } from "@racwa/react-components";

import type { SearchedVehicleDetail } from "../../types";
import type { ConfirmVehicleAction } from "./actions";
import type { ConfirmVehicleContentfulSchema } from "./schema";
import ConfirmVehicleForm from "./form";

export type ConfirmVehicleProps = {
  vehicleCardInfo: VehicleCardInfo & {
    registration: string;
    colour: string;
    vehicleType: SearchedVehicleDetail["vehicleType"];
  };
  contentfulData: z.infer<typeof ConfirmVehicleContentfulSchema>;
  confirmVehicleAction: ConfirmVehicleAction;
};

export const ConfirmVehicleContainer: React.FC<ConfirmVehicleProps> = ({
  vehicleCardInfo,
  contentfulData,
  confirmVehicleAction,
}) => {
  return (
    <Grid container direction={"column"} spacing={3}>
      <Grid size={12}>
        <Typography variant="h3">{contentfulData.heading}</Typography>
      </Grid>
      {contentfulData.subheading && (
        <Grid size={12}>
          <Typography>{contentfulData.subheading}</Typography>
        </Grid>
      )}
      <Grid size={12}>
        <PolicyDetailsCard
          id="your-vehicle-details-card"
          policyTitle={vehicleCardInfo.title}
          policySubtitle={vehicleCardInfo.subtitle}
          properties={[
            { key: "Registration", value: vehicleCardInfo.registration },
            { key: "Vehicle colour", value: vehicleCardInfo.colour },
          ]}
        >
          {vehicleCardInfo.vehicleType === "CAR" ? <CarGRFX001NoPadding /> : <MotoGRFX016NoPadding />}
        </PolicyDetailsCard>
      </Grid>
      <Grid size={12}>
        <ConfirmVehicleForm contentfulData={contentfulData} confirmVehicleAction={confirmVehicleAction} />
      </Grid>
    </Grid>
  );
};
