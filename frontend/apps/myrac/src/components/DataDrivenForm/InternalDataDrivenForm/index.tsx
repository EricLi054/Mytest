"use client";

import type FormTemplateCommonProps from "@data-driven-forms/common/form-template";
import type { Schema } from "@data-driven-forms/react-form-renderer/common-types";
import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import FormTemplate from "@data-driven-forms/mui-component-mapper/form-template";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import { MFAProvider } from "#providers/mfa";
import { MFASessionKey } from "#utils/mfaSessionKey";

import { serverRacwaComponentMapper } from "../componentMapper/server";
import { FormDataProvider } from "../FormDataProvider";
import { racwaValidationMapper } from "../validationMapper";
import { onSubmit } from "./util";

export default function InternalDataDrivenForm({
  schema,
  data,
}: {
  schema: Schema;
  data: { person?: z.infer<typeof PersonSchema>; loginEmail: string };
}) {
  return (
    <MFAProvider sessionKey={MFASessionKey.ContactDetails}>
      <FormDataProvider person={data.person} loginEmail={data.loginEmail}>
        <FormRenderer
          componentMapper={serverRacwaComponentMapper}
          validatorMapper={racwaValidationMapper}
          FormTemplate={(props: FormTemplateCommonProps) => (
            <FormTemplate {...props} Header={() => null} showFormControls={false} />
          )}
          schema={schema}
          onSubmit={onSubmit}
        />
      </FormDataProvider>
    </MFAProvider>
  );
}
