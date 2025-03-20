import type { z } from "zod";

import type { UpdateVehicleFormSchema } from "../(form)/update-vehicle/schema";
import type { YourVehicleFormSchema } from "../(form)/your-vehicle/schema";
import type { SearchedVehicleDetail, VehicleDetail } from "../types";

export type UpdateYourVehicleSession = {
  readonly crmId: string;
  readonly firstName: string;
  readonly productHoldingHeaderId: string;
  readonly productHoldingLineId: string;
  readonly currentVehicleDetails: Readonly<VehicleDetail>;
  searchedVehicleDetails: Readonly<SearchedVehicleDetail> | undefined;
  steps: {
    yourVehicle: z.infer<typeof YourVehicleFormSchema> | undefined;
    updateVehicle: z.infer<typeof UpdateVehicleFormSchema> | undefined;
    confirmVehicle: { vehicleUpdated: boolean };
  };
};
