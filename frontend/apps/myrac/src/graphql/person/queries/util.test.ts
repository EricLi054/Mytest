import { describe, expect, it } from "vitest";

import { allAddressSections, basicAddress, noBuildingSection, poBoxAddress, unitAddress } from "./testData";
import { getFormattedAddress } from "./util";

describe("Person Utils", () => {
  it("should return correct unmasked formatted address for all sections", () => {
    expect(getFormattedAddress(allAddressSections, false)).toEqual(
      "Building SubBuilding, UnitNumber/LotNumber HouseNumber POBox StreetName Suburb, State Postcode",
    );
  });

  it("should return correct masked formatted address for all sections", () => {
    expect(getFormattedAddress(allAddressSections, true)).toEqual(
      "******** ***********, ******************** *********** ***** ********** Suburb, State Postcode",
    );
  });

  it("should return correct unmasked formatted address for no building section", () => {
    expect(getFormattedAddress(noBuildingSection, false)).toEqual(
      "UnitNumber/LotNumber HouseNumber POBox StreetName Suburb, State Postcode",
    );
  });

  it("should return correct masked formatted address for no building section", () => {
    expect(getFormattedAddress(noBuildingSection, true)).toEqual(
      "******************** *********** ***** ********** Suburb, State Postcode",
    );
  });

  it("should return correct unmasked formatted address for basic address", () => {
    expect(getFormattedAddress(basicAddress, false)).toEqual("HouseNumber StreetName Suburb, State Postcode");
  });

  it("should return correct masked formatted address for basic address", () => {
    expect(getFormattedAddress(basicAddress, true)).toEqual("*********** ********** Suburb, State Postcode");
  });

  it("should return correct unmasked formatted address for unit address", () => {
    expect(getFormattedAddress(unitAddress, false)).toEqual("UnitNumber/HouseNumber StreetName Suburb, State Postcode");
  });

  it("should return correct masked formatted address for unit address", () => {
    expect(getFormattedAddress(unitAddress, true)).toEqual("********************** ********** Suburb, State Postcode");
  });

  it("should return correct unmasked formatted address for po box address", () => {
    expect(getFormattedAddress(poBoxAddress, false)).toEqual("POBox StreetName Suburb, State Postcode");
  });

  it("should return correct masked formatted address for po box address", () => {
    expect(getFormattedAddress(poBoxAddress, true)).toEqual("***** ********** Suburb, State Postcode");
  });
});
