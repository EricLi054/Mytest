import { MAX_VEHICLE_HEIGHT, MAX_VEHICLE_LENGTH, MAX_VEHICLE_WEIGHT, MAX_VEHICLE_WIDTH } from "#constants";

import type { Result } from "@racwa/types";

export type VehicleCardInfo = {
  title: string;
  subtitle: string;
  isOverweightOrOversize: boolean;
};

type VehicleInfo = {
  year: number | null;
  make: string | null;
  model: string | null;
  variant: string | null;
  body: string | null;
  transmission: string | null;
  fuel: string | null;
  kerbWeight: number | null;
  height: number | null;
  length: number | null;
  width: number | null;
};

export function getVehicleCardInfo({
  make,
  model,
  year,
  variant,
  body,
  transmission,
  fuel,
  ...info
}: VehicleInfo): Result<{ value: VehicleCardInfo }> {
  if (!year || !make || !model) {
    return { success: false };
  }

  const title = [year, make].map((value) => value.toString().toUpperCase()).join(" ");

  const subtitle = [model, variant, body, transmission, fuel]
    .filter(Boolean)
    .map((value) => value?.toUpperCase())
    .join(" ");

  const isOverweightOrOversize = checkOverweightOrOversize(info);

  const vehicleCardInfo: VehicleCardInfo = {
    title,
    subtitle,
    isOverweightOrOversize,
  };

  return { success: true, ...vehicleCardInfo };
}

export function checkOverweightOrOversize({
  kerbWeight,
  height,
  length,
  width,
}: Pick<VehicleInfo, "kerbWeight" | "height" | "length" | "width">): boolean {
  if (kerbWeight == null || height == null || length == null || width == null) {
    return false;
  }

  return (
    kerbWeight > MAX_VEHICLE_WEIGHT ||
    height > MAX_VEHICLE_HEIGHT ||
    length > MAX_VEHICLE_LENGTH ||
    width > MAX_VEHICLE_WIDTH
  );
}
