import type { FormOptions } from "@data-driven-forms/react-form-renderer";
import type { JSX } from "react";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

const RequiresConfirmationFunction: z.ZodType<(dirtyValues: Record<string, boolean>) => boolean> = z
  .any()
  .nullable()
  .optional();

type ConfirmationComponentProps = (props: {
  onConfirm: () => void;
  onCancel: () => void;
  logNameChangeEvent: (event: string) => Promise<void>;
}) => JSX.Element;

const ConfirmationContentComponent: z.ZodType<ConfirmationComponentProps> = z.any().nullable().optional();

const ConfirmationLoggerFunction: z.ZodType<(log: string) => Promise<void>> = z.any().nullable().optional();

export const WizardContextSchema = z.object({
  handlePrev: z.function(),
});

export const FieldSchema = z.object({
  label: z.string(),
  successTitle: z.string(),
  successText: RichTextSchema.nullable().optional(),
  successButtonText: z.string(),
  errorTitle: z.string(),
  errorText: RichTextSchema.nullable().optional(),
  errorButtonText: z.string(),
  requiresConfirmation: RequiresConfirmationFunction.optional(),
  confirmationTitle: z.string().nullable().optional(),
  ConfirmationContent: ConfirmationContentComponent.nullable().optional(),
  confirmationLogger: ConfirmationLoggerFunction.nullable().optional(),
});

const getStateType: z.ZodType<FormOptions["getState"]> = z.any();
const resetType: z.ZodType<FormOptions["reset"]> = z.any();

export const FormApiSchema = z.object({
  getState: getStateType,
  reset: resetType,
  handleSubmit: z.function().returns(z.boolean().promise()),
});
