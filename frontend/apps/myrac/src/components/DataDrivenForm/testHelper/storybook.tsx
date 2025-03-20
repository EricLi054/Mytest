import type { FormTemplateCommonProps } from "@data-driven-forms/common";
import type { Schema } from "@data-driven-forms/react-form-renderer";
import type { StoryFn } from "@storybook/react";
import type { PersonSchema } from "#graphql/person/queries/schema";
import type { ReactNode } from "react";
import type { z } from "zod";
import { FormRenderer } from "@data-driven-forms/react-form-renderer";

import { racwaComponentMapper } from "../componentMapper";
import { FormDataProvider } from "../FormDataProvider";
import { racwaValidationMapper } from "../validationMapper";

export type DataDrivenFormStoryProps = {
  schema: Schema;
};

const mockPerson: z.infer<typeof PersonSchema> = {
  title: "Mr",
  firstName: "John",
  surname: "Doe",
  cardColour: "Gold",
  racId: "123456",
  membershipCardNumber: "1231231231231231",
  membershipType: "Gold",
  tier: "Gold",
  mobilePhone: "0400123456",
  personalEmailAddress: "test@test.com",
};

export const DDFStoryTemplate: StoryFn<DataDrivenFormStoryProps> = ({ schema }) => (
  <FormDataProvider person={mockPerson} loginEmail="test@test.com">
    <FormRenderer
      componentMapper={racwaComponentMapper}
      validatorMapper={racwaValidationMapper}
      FormTemplate={({ formFields }: FormTemplateCommonProps) => <form>{formFields as ReactNode}</form>}
      schema={schema}
      onSubmit={async () => {
        return Promise.resolve(true);
      }}
    />
  </FormDataProvider>
);
