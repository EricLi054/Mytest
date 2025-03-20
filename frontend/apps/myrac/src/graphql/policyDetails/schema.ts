import { z } from "zod";

export const AlertSchema = z.object({
  message: z.string(),
  severity: z.string(),
});

export const AnalyticsSchema = z.object({
  description: z.string(),
});

export const SubActionSchema = z.object({
  type: z.string().nullable().optional(),
  label: z.string().nullable(),
  subLabel: z.string().nullable(),
  link: z.string().nullable(),
  analytics: AnalyticsSchema.nullable(),
});

export const ActionSchema = z.object({
  type: z.string().nullable().optional(),
  label: z.string().nullable(),
  // TODO: subLabel doesn't exist in the schema but is used in convertToDropdownLinks
  subLabel: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  analytics: AnalyticsSchema.nullable().optional(),
  subActions: z.array(SubActionSchema).optional(),
});

export const PaymentMethodSchema = z.object({
  accountNumber: z.string(),
  bsb: z.string(),
  cardExpiry: z.string(),
  cardNumber: z.string(),
  link: z.string().nullable(),
  linkText: z.string().nullable(),
  title: z.string(),
  type: z.string(),
});

export const TooltipSchema = z.object({
  message: z.string(),
  title: z.string(),
});

export const PaymentFrequencySchema = z.object({
  frequency: z.string().nullable(),
  link: z.string().nullable(),
  linkText: z.string().nullable(),
  message: z.string().nullable(),
  preMessage: z.string().nullable(),
  title: z.string(),
});

export const BundledProductSchema = z.object({
  asset: z.string(),
  productName: z.string(),
});

export const BundledAmountSchema = z.object({
  label: z.string().optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  bundledProducts: z.array(BundledProductSchema).nullable().optional(),
});

export const PolicyItemSchema = z.object({
  label: z.string().optional(),
  value: z.string().optional(),
  paymentMethod: PaymentMethodSchema.nullable().optional(),
  tooltip: TooltipSchema.nullable().optional(),
  paymentFrequency: PaymentFrequencySchema.nullable().optional(),
  bundledAmount: BundledAmountSchema.nullable().optional(),
});

export const PolicyDetailSchema = z.object({
  type: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleSecondary: z.any().nullable().optional(),
  registrationNumber: z.string().nullable().optional(),
  alerts: z.array(AlertSchema).nullable().optional(),
  actions: z.array(ActionSchema).nullable().optional(),
  policyItems: z.array(PolicyItemSchema).nullable().optional(),
});

export const PolicyDetailsSchema = z.object({
  policyDetails: z.array(PolicyDetailSchema),
});

export const GraphQLErrorSchema = z.object({
  message: z.any().nullable().optional(),
  path: z.any().nullable().optional(),
  extensions: z.any().nullable().optional(),
});

export const SystemKeySchema = z.union([z.literal("FinOps"), z.literal("Finance"), z.literal("Shield")]);

export const PartialResultsExtensionSchema = z.object({
  code: z.string().optional(),
  type: z.literal("PARTIAL_PRODUCT_RESULTS_ERROR"),
  systemKey: SystemKeySchema,
});

export const PartialResultsErrorSchema = GraphQLErrorSchema.merge(
  z.object({ extensions: PartialResultsExtensionSchema }),
);

export const PolicyDetailsResponseSchema = z.object({
  data: PolicyDetailsSchema.nullable().optional(),
  errors: z.array(GraphQLErrorSchema).nullable().optional(),
});
