import type {
  ActionSchema,
  AnalyticsSchema,
  BundledAmountSchema,
  BundledProductSchema,
  PaymentFrequencySchema,
  PaymentMethodSchema,
  PolicyDetailSchema,
  PolicyItemSchema,
} from "#graphql/policyDetails/schema";
import type { z } from "zod";

export type GAProps = z.infer<typeof AnalyticsSchema>;

export type PolicyDetailsCardProps = {
  data: PolicyDetailsCardContent;
};

export type PolicyItem = z.infer<typeof PolicyItemSchema>;

export type PolicyDetailsCardContent = z.infer<typeof PolicyDetailSchema>;

export type BundledAmount = z.infer<typeof BundledAmountSchema>;

export type BundledProduct = z.infer<typeof BundledProductSchema>;

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export type PaymentFrequency = z.infer<typeof PaymentFrequencySchema>;

export type Action = z.infer<typeof ActionSchema>;

export type DropdownLink = {
  label: string;
  subLabel?: string;
  link: string;
  analytics?: GAProps;
};
