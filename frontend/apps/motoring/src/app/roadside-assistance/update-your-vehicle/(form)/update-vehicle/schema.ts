import { INVALID_ERROR, REQUIRED_ERROR } from "#constants";
import { NotificationCardSchema, RichTextContentSchema } from "#contentful/schema";
import { z } from "zod";

export const vehicleColourOptions = [
  "Aqua",
  "Beige",
  "Black",
  "Blue",
  "Brown",
  "Cream",
  "Gold",
  "Green",
  "Grey",
  "Maroon",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "Silver",
  "Tan",
  "White",
  "Yellow",
] as const;

// Won't need to export constant values when fields.name.value is inferred more strictly
// see: https://github.com/edmundhung/conform/pull/541
export const VehicleType = {
  Car: "Car",
  Motorcycle: "Motorcycle",
} as const;

export const vehicleTypeOptions = [VehicleType.Car, VehicleType.Motorcycle] as const;

export const isValidVehicleType = (type: string | undefined): type is (typeof vehicleTypeOptions)[number] =>
  vehicleTypeOptions.includes(type as (typeof vehicleTypeOptions)[number]);

export const UpdateVehicleFormSchema = z.object({
  vehicleType: z.enum(vehicleTypeOptions, {
    required_error: REQUIRED_ERROR,
    invalid_type_error: INVALID_ERROR,
  }),
  vehicleRego: z
    .string({ required_error: REQUIRED_ERROR, invalid_type_error: INVALID_ERROR })
    .min(1, { message: INVALID_ERROR })
    .max(9, { message: INVALID_ERROR })
    .transform((val) => val.toUpperCase())
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^[A-Z0-9 ]+$/.test(val), {
      message: INVALID_ERROR,
    }),
  vehicleSelect: z.literal("true", {
    required_error: REQUIRED_ERROR,
    invalid_type_error: INVALID_ERROR,
  }),
  vehicleNotFound: z.enum(["true", "false"]).refine((val) => val === "false", {
    message: INVALID_ERROR,
  }),
  vehicleColour: z.enum(vehicleColourOptions, {
    required_error: REQUIRED_ERROR,
    invalid_type_error: INVALID_ERROR,
  }),
});

export const UpdateVehicleContentfulSchema = z.object({
  heading: z.string(),
  subheading: z.string().nullable().optional(),
  fields: z.object({
    vehicleType: z.object({
      label: z.string(),
      requiredErrorMessage: z.string(),
      invalidErrorMessage: z.string(),
      tooltipTitle: z.string().nullable().optional(),
      tooltipContent: RichTextContentSchema.nullable().optional(),
    }),
    vehicleRego: z.object({
      label: z.string(),
      placeholder: z.string(),
      requiredErrorMessage: z.string(),
      invalidErrorMessage: z.string(),
      tooltipTitle: z.string().nullable().optional(),
      tooltipContent: RichTextContentSchema.nullable().optional(),
    }),
    vehicleSelect: z.object({
      label: z.string(),
      requiredErrorMessage: z.string(),
      invalidErrorMessage: z.string(),
    }),
    vehicleNotFound: z.object({
      label: z.string(),
      requiredErrorMessage: z.string(),
      invalidErrorMessage: z.string(),
    }),
    vehicleColour: z.object({
      label: z.string(),
      placeholder: z.string(),
      requiredErrorMessage: z.string(),
      invalidErrorMessage: z.string(),
      tooltipTitle: z.string().nullable().optional(),
      tooltipContent: RichTextContentSchema.nullable().optional(),
    }),
  }),
  notifications: z.object({
    cantFindVehicle: NotificationCardSchema,
    oversizeOrOverweightVehicle: NotificationCardSchema,
  }),
});
