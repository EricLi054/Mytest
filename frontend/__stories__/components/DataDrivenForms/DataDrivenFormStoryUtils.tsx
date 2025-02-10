import { racwaComponentMapper } from '@/components/DataDrivenForm/racwaComponentMapper';
import { racwaValidationMapper } from '@/components/DataDrivenForm/racwaValidationMapper';
import { type FormTemplateCommonProps } from '@data-driven-forms/common';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import { FormRenderer, type Schema } from '@data-driven-forms/react-form-renderer';
import { type StoryFn } from '@storybook/react';

interface FormError {
  extensions: {
    type: string;
  };
}
export interface DataDrivenFormStoryProps {
  schema: Schema;
  template?: React.ComponentType<FormTemplateCommonProps>;
  initialValues?: any;
  onSubmit?: (values: any, form: any) => { ok: boolean; data?: { errors?: FormError[] }; message?: string };
}

export const DDFStoryTemplate: StoryFn<DataDrivenFormStoryProps> = ({ schema, initialValues, onSubmit, template }) => (
  <FormRenderer
    componentMapper={racwaComponentMapper}
    validatorMapper={racwaValidationMapper}
    FormTemplate={
      template ?? ((props: any) => <FormTemplate {...props} Header={() => null} showFormControls={false} />)
    }
    schema={schema}
    initialValues={initialValues}
    onSubmit={onSubmit}
  />
);
