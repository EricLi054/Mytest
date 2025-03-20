import { z } from "zod";

export const PersonAddressSchema = z.object({
  buildingName: z.string().nullable().optional(),
  subBuildingNumber: z.string().nullable().optional(),
  unitNumber: z.string().nullable().optional(),
  lotNumber: z.string().nullable().optional(),
  houseNumber: z.string().nullable().optional(),
  poBox: z.string().nullable().optional(),
  streetName: z.string().nullable().optional(),
  suburb: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  postcode: z.string().nullable().optional(),
});

export const DigitalCardDetailsSchema = z.object({
  id: z.string(),
  passId: z.string().nullable().optional(),
  isActive: z.boolean(),
  passUrl: z.string().nullable().optional(),
  numberOfPassesInstalled: z.number(),
});

export const RawPersonSchema = z.object({
  racId: z.string(),
  title: z.string().nullable(),
  firstName: z.string(),
  middleName: z.string().nullable().optional(),
  surname: z.string().nullable(),
  membershipCardNumber: z.string().nullable(),
  membershipType: z.string(),
  tier: z.string(),
  homePhone: z.string().nullable().optional(),
  mobilePhone: z.string().nullable().optional(),
  workPhone: z.string().nullable().optional(),
  personalEmailAddress: z.string().nullable().optional(),
  postalAddress: PersonAddressSchema.optional(),
  digitalCardDetails: DigitalCardDetailsSchema.nullable().optional(),
});

export const PersonSchema = RawPersonSchema.extend({
  cardColour: z.string(),
  formattedAddress: z.string().optional(),
});
