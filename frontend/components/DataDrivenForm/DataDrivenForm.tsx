'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import type { ComponentMapper, Schema } from '@data-driven-forms/react-form-renderer/common-types';
import type FormTemplateCommonProps from '@data-driven-forms/common/form-template';

import { serverRacwaComponentMapper } from './serverRacwaComponentMapper';
import { racwaValidationMapper } from './racwaValidationMapper';
import personUpdateHandler from './handlers/personUpdateHandler';

export interface DataDrivenFormProps {
  schema: Schema;
  initialValues?: any;
  template?: React.ComponentType<FormTemplateCommonProps>;
  componentMapper?: ComponentMapper;
}

export const DataDrivenForm = ({ schema, initialValues, template, componentMapper }: DataDrivenFormProps) => {
  const Template = template ?? FormTemplate;
  const mapper = componentMapper ?? serverRacwaComponentMapper;

  return (
    <Grid>
      <FormRenderer
        componentMapper={mapper}
        validatorMapper={racwaValidationMapper}
        FormTemplate={(props: any) => <Template {...props} Header={() => null} showFormControls={false} />}
        schema={schema}
        onSubmit={async (values: any, form: any) => {
          const modified = form.getState().modified;
          const updatedValues: Record<string, any> = {};
          Object.keys(modified).forEach((key: string) => {
            if (modified[key]) {
              updatedValues[key] = values[key] ?? '';
            }
          });
          return await personUpdateHandler(updatedValues);
        }}
        initialValues={initialValues}
      />
    </Grid>
  );
};
