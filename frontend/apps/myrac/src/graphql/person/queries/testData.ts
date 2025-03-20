import type { z } from "zod";

import type { PersonAddressSchema } from "./schema";

export const allAddressSections: z.infer<typeof PersonAddressSchema> = {
  buildingName: "Building",
  subBuildingNumber: "SubBuilding",
  unitNumber: "UnitNumber",
  lotNumber: "LotNumber",
  houseNumber: "HouseNumber",
  poBox: "POBox",
  streetName: "StreetName",
  suburb: "Suburb",
  state: "State",
  postcode: "Postcode",
};

export const noBuildingSection: z.infer<typeof PersonAddressSchema> = {
  buildingName: "",
  subBuildingNumber: "",
  unitNumber: "UnitNumber",
  lotNumber: "LotNumber",
  houseNumber: "HouseNumber",
  poBox: "POBox",
  streetName: "StreetName",
  suburb: "Suburb",
  state: "State",
  postcode: "Postcode",
};

export const basicAddress: z.infer<typeof PersonAddressSchema> = {
  buildingName: "",
  subBuildingNumber: "",
  unitNumber: "",
  lotNumber: "",
  houseNumber: "HouseNumber",
  poBox: "",
  streetName: "StreetName",
  suburb: "Suburb",
  state: "State",
  postcode: "Postcode",
};

export const unitAddress: z.infer<typeof PersonAddressSchema> = {
  buildingName: "",
  subBuildingNumber: "",
  unitNumber: "UnitNumber",
  lotNumber: "",
  houseNumber: "HouseNumber",
  poBox: "",
  streetName: "StreetName",
  suburb: "Suburb",
  state: "State",
  postcode: "Postcode",
};

export const poBoxAddress: z.infer<typeof PersonAddressSchema> = {
  buildingName: "",
  subBuildingNumber: "",
  unitNumber: "",
  lotNumber: "",
  houseNumber: "",
  poBox: "POBox",
  streetName: "StreetName",
  suburb: "Suburb",
  state: "State",
  postcode: "Postcode",
};
