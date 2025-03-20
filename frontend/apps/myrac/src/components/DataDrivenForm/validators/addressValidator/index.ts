import type { z } from "zod";

import type { AddressInputValueType } from "../../components/AddressInput/schema";
import { ValidationOptionsSchema } from "../schema";

const addressValidator = (options?: object) => (value?: z.infer<z.ZodNullable<typeof AddressInputValueType>>) => {
  if (!value || typeof value === "string") {
    return undefined;
  }

  const validatedOptions = ValidationOptionsSchema.safeParse(options);

  if (validatedOptions.success) {
    if (!value.dpid) {
      return validatedOptions.data.message;
    }
  }

  return undefined;
};

export default addressValidator;
