import { z } from "zod";

export const AddressListSchema = z.object({
  addressList: z.object({
    data: z.array(
      z.object({
        id: z.string(),
        attributes: z.object({
          partialAddress: z.string(),
          picklist: z.string(),
        }),
      }),
    ),
  }),
});

export const AddressValidationAttributes = z.object({
  buildingName: z.string(),
  unit: z.string(),
  allotmentNumber: z.string(),
  buildingNumber: z.string(),
  subBuildingNumber: z.string(),
  streetName: z.string(),
  streetType: z.string(),
  postalDeliveryNumber: z.string(),
  locality: z.string(),
  stateCode: z.string(),
  postcode: z.string(),
  country: z.string(),
});

export const AddressValidationSchema = z.object({
  validatePAF: z.object({
    data: z.object({
      id: z.string(),
      attributes: AddressValidationAttributes,
    }),
  }),
});
