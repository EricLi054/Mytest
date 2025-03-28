import type { z } from "zod";
import { getAddressList, validateAddress } from "#graphql/address";

import type { AddressInputValidatedValue, ParsedAddressValue } from "./schema";

type SearchAddressFunctionResponse = { error: boolean; options: { value: string; label: string }[] };
export type SearchAddressFunction = (inputtedAddress: string) => Promise<SearchAddressFunctionResponse>;

type ValidateSelectedAddressFunctionResponse = z.infer<typeof AddressInputValidatedValue> | null;
export type ValidateSelectedAddressFunction = (
  toValidate: z.infer<typeof ParsedAddressValue>,
) => Promise<ValidateSelectedAddressFunctionResponse>;

export const searchAddress = async (inputtedAddress: string) => {
  try {
    const data = await getAddressList(inputtedAddress);

    const options = data.map((address) => ({
      value: address.id,
      label: address.attributes.partialAddress,
    }));

    return { options, error: false };
  } catch (ex) {
    console.error(ex);
    return { options: [], error: true };
  }
};

export const validateSelectedAddress = async (toValidate: z.infer<typeof ParsedAddressValue>) => {
  try {
    const validation = await validateAddress(toValidate.value);

    if (validation.id) {
      const { id, attributes } = validation;

      const validatedAddress: z.infer<typeof AddressInputValidatedValue> = {
        dpid: id,
        buildingName: attributes.buildingName,
        subBuildingNumber: attributes.subBuildingNumber,
        unitNumber: attributes.unit,
        lotNumber: attributes.allotmentNumber,
        houseNumber: attributes.buildingNumber,
        streetName:
          attributes.postalDeliveryNumber !== ""
            ? `PO Box ${attributes.postalDeliveryNumber}`
            : `${attributes.streetName}${attributes.streetType ? ` ${attributes.streetType}` : ""}`,
        poBox: attributes.postalDeliveryNumber !== "" ? `PO Box ${attributes.postalDeliveryNumber}` : "",
        suburb: attributes.locality,
        state: attributes.stateCode,
        postcode: attributes.postcode,
        country: attributes.country,
      };

      return validatedAddress;
    }
  } catch {
    console.error("Error validating the address selected.");
  }

  return null;
};
