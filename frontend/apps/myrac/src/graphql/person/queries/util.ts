import type { z } from "zod";

import type { PersonAddressSchema, RawPersonSchema } from "./schema";
import { PersonSchema } from "./schema";
import { maskData, maskStringArray } from "./util.masking";

export const getFormattedAddress = (address: z.infer<typeof PersonAddressSchema>, masked: boolean) => {
  let buildingNameSection: string[] = [];
  let unitNumberSection: string[] = [];
  let streetSection: string[] = [];
  const stateSection: string[] = [];

  if (address.buildingName) buildingNameSection.push(address.buildingName);
  if (address.subBuildingNumber) buildingNameSection.push(address.subBuildingNumber);

  if (address.unitNumber) unitNumberSection.push(address.unitNumber + "/");

  if (address.lotNumber) streetSection.push(address.lotNumber);
  if (address.houseNumber) streetSection.push(address.houseNumber);
  if (address.poBox) streetSection.push(address.poBox);
  if (address.streetName) streetSection.push(address.streetName);

  if (masked) {
    buildingNameSection = maskStringArray(buildingNameSection);
    unitNumberSection = maskStringArray(unitNumberSection);
    streetSection = maskStringArray(streetSection);
  }

  if (address.suburb) streetSection.push(address.suburb);
  if (address.state) stateSection.push(address.state);
  if (address.postcode) stateSection.push(address.postcode);

  let formattedAddress = "";

  if (buildingNameSection.length > 0) formattedAddress += buildingNameSection.join(" ") + ", ";
  if (unitNumberSection.length > 0) formattedAddress += unitNumberSection[0];
  formattedAddress += streetSection.join(" ") + ", " + stateSection.join(" ");

  return formattedAddress;
};

const getCardColour = (tier: string) => {
  switch (tier) {
    case "Red Card":
      return "Red";
    case "St Ives":
    case "St Ives Staff":
    case "Staff":
      return "Gold";
    case "Life":
    case "New Life":
      return "Gold Life";
    case "Blue":
    case "Bronze":
    case "Silver":
    case "Gold":
    case "Gold Life":
    case "Little Legends":
    case "Road Ready":
    case "Free2Go":
    case "RAC Ignite":
      return tier;
    default:
      return "None";
  }
};

export const transformPersonData = (data: z.infer<typeof RawPersonSchema>, masked: boolean) => {
  if (data.title === "Doctor") {
    data.title = "Dr";
  }

  const transformedData = {
    ...maskData(data, masked),
    cardColour: getCardColour(data.tier),
    formattedAddress: data.postalAddress ? getFormattedAddress(data.postalAddress, masked) : undefined,
  };

  return PersonSchema.parse(transformedData);
};
