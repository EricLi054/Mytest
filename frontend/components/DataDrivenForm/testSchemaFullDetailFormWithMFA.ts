'use client'
import { type Schema } from '@data-driven-forms/react-form-renderer'
import { EditableFormWizard } from './dynamic-components/Wizard/EditableFormWizard'
import componentTypes from './dynamic-components/componentTypes'
import { displayPage, editPage } from './testSchemaFullDetailForm'

export const testSchemaFullDetailFormWithMFA: Schema = {
  title: 'Name',
  fields: [
    {
      component: componentTypes.WIZARD,
      name: 'wizard',
      wizard: EditableFormWizard,
      title: 'Name',
      fields: [
        {
          name: 'display',
          fields: displayPage,
          nextStep: 'edit',
          requiresMfaToProceed: true
        },
        {
          name: 'edit',
          fields: editPage
        }
      ]
    }
  ]
}
