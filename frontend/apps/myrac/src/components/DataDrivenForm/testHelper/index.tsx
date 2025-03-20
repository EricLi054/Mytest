import type FormTemplateCommonProps from "@data-driven-forms/common/form-template";
import type { Field } from "@data-driven-forms/react-form-renderer";
import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import FormTemplate from "@data-driven-forms/mui-component-mapper/form-template";
import { componentTypes, FormRenderer } from "@data-driven-forms/react-form-renderer";
import { LoadingProvider } from "#providers/loading";
import { MFAProvider } from "#providers/mfa";
import { ModalProvider } from "#providers/modal";
import { MFASessionKey } from "#utils/mfaSessionKey";

import { serverRacwaComponentMapper } from "../componentMapper/server";
import { FormDataProvider } from "../FormDataProvider";
import { racwaValidationMapper } from "../validationMapper";

const fullTestSchema = (fields: Field[], fieldsPage2?: Field[]) => {
  const fieldsSchema = [{ name: "Test Form Page", fields, nextStep: fieldsPage2 ? "Test Form Page 2" : undefined }];
  if (fieldsPage2) {
    fieldsSchema.push({ name: "Test Form Page 2", fields: fieldsPage2, nextStep: undefined });
  }
  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: "wizard",
        title: "Test Form",
        fields: fieldsSchema,
      },
    ],
  };
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

export const TestFormRenderer = ({
  fields,
  submitResponse = true,
  fieldsPage2,
}: {
  fields: Field[];
  submitResponse?: boolean;
  fieldsPage2?: Field[];
}) => {
  return (
    <LoadingProvider>
      <ModalProvider>
        <MFAProvider sessionKey={MFASessionKey.ContactDetails}>
          <FormDataProvider person={mockPerson} loginEmail="test@test.com">
            <FormRenderer
              componentMapper={serverRacwaComponentMapper}
              validatorMapper={racwaValidationMapper}
              FormTemplate={(props: FormTemplateCommonProps) => (
                <FormTemplate {...props} Header={() => null} showFormControls={false} />
              )}
              schema={fullTestSchema(fields, fieldsPage2)}
              onSubmit={async () => {
                return Promise.resolve(submitResponse);
              }}
            />
          </FormDataProvider>
        </MFAProvider>
      </ModalProvider>
    </LoadingProvider>
  );
};
