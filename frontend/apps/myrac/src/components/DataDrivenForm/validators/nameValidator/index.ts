import type { z } from "zod";

import { ValidationOptionsSchema } from "../schema";

// validation rules https://rac-wa.atlassian.net/wiki/spaces/DDA4/pages/908133678/Name+fields
const firstNameRegEx = /^[a-zA-Z\-'() ]{1,50}$/;
const middleNameRegEx = /^[a-zA-Z\-'() ]{0,50}$/;
const lastNameRegEx = /^[a-zA-Z\-'() ]{1,55}$/;

const nameValidator = (options?: object) => (value?: z.infer<z.ZodNullable<z.ZodString>>) => {
  if (!value) {
    return undefined;
  }

  const validatedOptions = ValidationOptionsSchema.safeParse(options);

  if (validatedOptions.success && validatedOptions.data.nameType) {
    let regExToUse = null;

    switch (validatedOptions.data.nameType) {
      case "firstName":
        regExToUse = firstNameRegEx;
        break;
      case "middleName":
        regExToUse = middleNameRegEx;
        break;
      case "lastName":
        regExToUse = lastNameRegEx;
        break;
    }

    if (!regExToUse) {
      console.error("Unsupported nameType supplied to nameValidator.");
      return undefined;
    }

    if (!regExToUse.test(value)) {
      return validatedOptions.data.message;
    }
  }

  return undefined;
};

export default nameValidator;
