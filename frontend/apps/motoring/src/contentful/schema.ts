import { z } from "zod";

export const RichTextContentSchema = z.object({
  json: z.object({
    nodeType: z.string(),
    data: z.object({}).passthrough(),
    content: z.array(
      z.object({
        nodeType: z.string(),
        data: z.object({}).passthrough(),
        content: z
          .array(
            z.object({
              nodeType: z.string(),
              value: z.string().optional(),
              marks: z.array(z.object({})).optional(),
              data: z.object({}).passthrough(),
              content: z
                .array(
                  z.object({
                    nodeType: z.string(),
                    value: z.string().optional(),
                    marks: z.array(z.object({})).optional(),
                    data: z.object({}).passthrough(),
                    content: z
                      .array(
                        z.object({
                          nodeType: z.string(),
                          value: z.string().optional(),
                          marks: z.array(z.object({})).optional(),
                          data: z.object({}).passthrough(),
                          content: z
                            .array(
                              z.object({
                                nodeType: z.string(),
                                value: z.string().optional(),
                                marks: z.array(z.object({})).optional(),
                                data: z.object({}).passthrough(),
                              }),
                            )
                            .optional(),
                        }),
                      )
                      .optional(),
                  }),
                )
                .optional(),
            }),
          )
          .optional(),
      }),
    ),
  }),
});

export const FieldItemSchema = z.object({
  name: z.string(),
  label: z.string(),
  placeholder: z.string().nullable().optional(),
  invalidErrorMessage: z.string().nullable().optional(),
  requiredErrorMessage: z.string().nullable().optional(),
  tooltipTitle: z.string().nullable().optional(),
  tooltipContent: RichTextContentSchema.nullable().optional(),
});

export const NotificationCardSchema = z.object({
  name: z.string(),
  title: z.string(),
  severity: z.string(),
  content: RichTextContentSchema,
});

export const CardSchema = z.object({
  name: z.string(),
  title: z.string(),
  content: RichTextContentSchema,
});

export const RawFormPageSchema = z.object({
  rac_stepperFormPage: z.object({
    heading: z.string(),
    subheading: z.string().nullable().optional(),
    fieldsCollection: z.object({
      items: z.array(FieldItemSchema),
    }),
    notificationCardsCollection: z
      .object({
        items: z.array(NotificationCardSchema),
      })
      .optional(),
    cardsCollection: z
      .object({
        items: z.array(CardSchema),
      })
      .optional(),
  }),
});

export const ErrorPageSchema = z.object({
  rac_stepperFormErrorPage: z.object({
    heading: z.string(),
    subheading: z.string(),
    content: RichTextContentSchema,
  }),
});

export const RawConfirmationPageSchema = z.object({
  rac_stepperFormConfirmationPage: z.object({
    heading: z.string().nullable(),
    subheading: z.string(),
    cardsCollection: z.object({
      items: z.array(CardSchema),
    }),
  }),
});
