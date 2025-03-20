import type { Schema } from "@data-driven-forms/react-form-renderer";
import type { z } from "zod";

import type { ContentfulDataDrivenFormSchema } from "./schema";
import { componentTypes } from "./components";
import { validatorTypes } from "./validators";

export const generateSchema = (formData: z.infer<typeof ContentfulDataDrivenFormSchema>): Schema => {
  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: "wizard",
        title: formData.title,
        fields: formData.pages.items.map((page) => {
          return {
            name: page.name,
            nextStep: page.nextStep?.name,
            fields: page.fields.items.map((field) => {
              return {
                name: field.name,
                component: field.component,
                label: field.label,
                helperText: field.helperText,
                tooltipTitle: field.tooltipTitle,
                tooltipText: field.tooltipText,
                required: field.required,
                placeholder: field.placeholder,
                validate: [
                  ...(field.required
                    ? [
                        {
                          type: validatorTypes.REQUIRED,
                          message: field.requiredMessage ?? undefined,
                        },
                      ]
                    : []),
                  ...(field.validators?.items
                    ? field.validators.items.map((validator) => {
                        return {
                          type: validator.validatorType,
                          message: validator.message,
                          pattern: validator.pattern ?? undefined,
                          nameType: validator.nameType ?? undefined,
                          phoneType: validator.phoneType ?? undefined,
                          maxAge: validator.maxAge ?? undefined,
                          minAge: validator.minAge ?? undefined,
                          ageOutOfRangeMessage: validator.ageOutOfRangeMessage ?? undefined,
                        };
                      })
                    : []),
                ],
                ...(field.conditionalLogic ? { condition: field.conditionalLogic } : {}),
                ...(field.selectOptions
                  ? {
                      options: field.selectOptions.map((value: string) => {
                        return { value };
                      }),
                    }
                  : {}),
                ...(field.richText ? { richText: field.richText } : {}),
                ...(field.successText ? { successText: field.successText } : {}),
                ...(field.errorText ? { errorText: field.errorText } : {}),
                initialValue: field.initialValue,
                initializeOnMount: true,
                ...(field.fixedLabelWidth ? { fixedLabelWidth: field.fixedLabelWidth } : {}),
                ...field.extraData,
              };
            }),
          };
        }),
      },
    ],
  };
};
