import type { FormOptions } from "@data-driven-forms/react-form-renderer";
import { z } from "zod";

import { AddressInputValidatedValue } from "../components/AddressInput/schema";

export const FormValueType = z.union([z.string(), AddressInputValidatedValue, z.null(), z.undefined()]);
export const FormValueMap = z.map(z.string(), FormValueType);

const getStateType: z.ZodType<FormOptions["getState"]> = z.any();
const getFieldStateType: z.ZodType<FormOptions["getFieldState"]> = z.any();

export const FormApi = z.object({
  getState: getStateType,
  getFieldState: getFieldStateType,
});
