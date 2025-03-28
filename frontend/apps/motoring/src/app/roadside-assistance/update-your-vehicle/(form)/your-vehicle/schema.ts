import { INVALID_ERROR, REQUIRED_ERROR } from "#constants";
import { NotificationCardSchema, RichTextContentSchema } from "#contentful/schema";
import { z } from "zod";

// Won't need to export constant values when fields.name.value is inferred more strictly
// see: https://github.com/edmundhung/conform/pull/541
export const VehicleUse = {
  Private: "Private use",
  Business: "Business use",
} as const;

export const vehicleUseOptions = [VehicleUse.Private, VehicleUse.Business] as const;

export const IsBrokenDown = {
  Yes: "Yes",
  No: "No",
} as const;

export const isBrokenDownOptions = [IsBrokenDown.Yes, IsBrokenDown.No] as const;

export const YourVehicleFormSchema = z
  .object({
    vehicleUse: z.enum(vehicleUseOptions, {
      required_error: REQUIRED_ERROR,
      invalid_type_error: INVALID_ERROR,
    }),
    isBrokenDown: z.enum(isBrokenDownOptions, {
      required_error: REQUIRED_ERROR,
      invalid_type_error: INVALID_ERROR,
    }),
  })
  .refine((data) => !(data.vehicleUse === "Business use" || data.isBrokenDown === "Yes"), { message: "" });

export const YourVehicleContentfulSchema = z.object({
  heading: z.string(),
  subheading: z.string().nullable().optional(),
  fields: z.object({
    vehicleUse: z.object({
      label: z.string(),
      requiredErrorMessage: z.string(),
      invalidErrorMessage: z.string(),
      tooltipTitle: z.string().nullable().optional(),
      tooltipContent: RichTextContentSchema.nullable().optional(),
    }),
    isBrokenDown: z.object({
      label: z.string(),
      requiredErrorMessage: z.string(),
      invalidErrorMessage: z.string(),
      tooltipTitle: z.string().nullable().optional(),
      tooltipContent: RichTextContentSchema.nullable().optional(),
    }),
  }),
  notifications: z.object({
    vehicleBrokenDownNotificationCard: NotificationCardSchema,
    businessUseNotificationCard: NotificationCardSchema,
  }),
});
