import { z } from "zod";

export const FinOpsResponseSchema = z.object({
  IsSuccess: z.boolean(),
  Value: z.unknown(),
});

export const FinOpsPaymentDetailSchema = z.object({
  Name: z.string(),
  BankShortName: z.string(),
  BankBSB: z.string(),
  BankAccountNum: z.string(),
  CreditCardMaskedNumber: z.string(),
  CreditCardToken: z.string(),
  CreditCardExpiryMonth: z.string(),
  CreditCardExpiryYear: z.string(),
  CreditCardTypeName: z.string(),
  CreditCardUniqueCardId: z.string(),
});

export const FinOpsProductHoldingPaymentScheduleSchema = z.object({
  CompanyId: z.string(),
  DueDate: z.string(),
  LineNum: z.number(),
  Amount: z.number(),
  RemainingAmount: z.number(),
  Posted: z.string(),
  Description: z.string(),
  Status: z.string(),
});

export const FinOpsVehicleDetailSchema = z.object({
  Type: z.string(),
  RegistrationNumber: z.string(),
  Make: z.string(),
  Model: z.string(),
  Variant: z.string(),
  BodyType: z.string(),
  Color: z.string(),
  Year: z.string(),
  NVIC: z.string(),
  VIN: z.string(),
  Series: z.string(),
  Transmission: z.string(),
  Cylinder: z.string(),
  CC: z.string(),
  CO2Emission: z.number(),
  FuelType: z.string(),
});

export const FinOpsProductChangeSchema = z.object({
  ProductId: z.string(),
  Action: z.string(),
  CanChangeProductHolding: z.boolean(),
  Reason: z.string(),
});

export const FinOpsProductHoldingLineSchema = z.object({
  CompanyId: z.string(),
  ProductHoldingId: z.string(),
  ProductHoldingVersion: z.number(),
  OrigProductHoldingId: z.string(),
  ProductId: z.string(),
  RenewalProductId: z.string(),
  ProductName: z.string(),
  CanUpdateVehicle: z.boolean(),
  CanUpdateVehicleReason: z.string(),
  StartDate: z.string(),
  EndDate: z.string(),
  CancelDate: z.string(),
  Amount: z.number(),
  VehicleDetail: FinOpsVehicleDetailSchema,
  ProductChanges: z.array(FinOpsProductChangeSchema),
  RenewalProductChanges: z.array(FinOpsProductChangeSchema),
});

export const FinOpsProductHoldingHeaderSchema = z.object({
  CompanyId: z.string(),
  ProductHoldingHeaderId: z.string(),
  UPN: z.string(),
  CustAccount: z.string(),
  StartDate: z.string(),
  EndDate: z.string(),
  Status: z.string(),
  StatusReason: z.string(),
  PaymentMode: z.string(),
  PaymentScheduleId: z.string(),
  TotalAmount: z.number(),
  TotalRemainingAmount: z.number(),
  TotalDueAmount: z.number(),
  PaymentDetail: FinOpsPaymentDetailSchema.nullable(),
  ProductHoldingLines: z.array(FinOpsProductHoldingLineSchema),
  ProductHoldingPaymSched: z.array(FinOpsProductHoldingPaymentScheduleSchema),
  RenewalProductHoldingHeaderId: z.string(),
  RenewalProductHoldingLines: z.array(FinOpsProductHoldingLineSchema),
  RenewalStartDate: z.string(),
  RenewalPaymentMode: z.string(),
  RenewalPaymentScheduleId: z.string(),
  RenewalTotalAmount: z.number(),
  RenewalTotalRemainingAmount: z.number(),
  RenewalPaymentDetail: FinOpsPaymentDetailSchema.nullable(),
  RenewalProductHoldingPaymSched: z.array(FinOpsProductHoldingPaymentScheduleSchema),
  PreviousProductHoldingHeaderId: z.string(),
  PreviousTotalRemainingAmount: z.number(),
});
