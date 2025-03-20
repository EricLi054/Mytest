import type { DeepPick, PickFromQuery } from "@racwa/types";

import type { getVehicleDetailsByRego } from "./(form)/update-vehicle/data";
import type { getRoadsideProductData } from "./session/data";

export type RoadsideProduct = PickFromQuery<typeof getRoadsideProductData, "me.roadsideProduct">;

export type RoadsideProductLine = DeepPick<RoadsideProduct, "line">;

export type CanUpdateVehicleReason = DeepPick<RoadsideProduct, "line.canUpdateVehicleReason">;

export type VehicleDetail = DeepPick<RoadsideProduct, "line.vehicleDetail">;

export type SearchedVehicleDetail = PickFromQuery<typeof getVehicleDetailsByRego, "vehicleByRego"> &
  Pick<VehicleDetail, "vehicleType">;

export type ServiceIsAlive = PickFromQuery<typeof getRoadsideProductData, "serviceIsAlive">;
