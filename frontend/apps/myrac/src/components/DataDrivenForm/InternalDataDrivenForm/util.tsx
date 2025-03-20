import type { z } from "zod";
import { updatePerson } from "#graphql/person/mutations";

import type { FormApi, FormValueMap } from "./schema";
import { FormValueType } from "./schema";

export const onSubmit = async (_: unknown, form: z.infer<typeof FormApi>) => {
  const modifiedValues = form.getState().modified;

  if (!modifiedValues) {
    return false;
  }

  const updatedValues: z.infer<typeof FormValueMap> = new Map();

  Object.entries(modifiedValues).forEach(([key, value]) => {
    if (value) {
      const parsedFieldValue = FormValueType.safeParse(form.getFieldState(key)?.value);

      if (parsedFieldValue.success) {
        updatedValues.set(key, parsedFieldValue.data ?? "");
      } else {
        updatedValues.set(key, "");
      }
    }
  });

  const updatedValueRecord = Object.fromEntries(updatedValues);

  return await updatePerson({ person: { request: updatedValueRecord } });
};
