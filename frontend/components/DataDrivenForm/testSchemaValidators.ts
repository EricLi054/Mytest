'use client'
import { type Schema } from '@data-driven-forms/react-form-renderer'
import componentTypes from '@data-driven-forms/react-form-renderer/component-types'
import { EditableFormWizard } from './dynamic-components/Wizard/EditableFormWizard'
import racwaComponentTypes from './dynamic-components/racwaComponentTypes'
import racwaValidatorTypes from './validators/racwaValidatorTypes'

const displayPage = [
  {
    component: componentTypes.PLAIN_TEXT,
    label: 'Test form',
    variant: 'h6',
    name: 'intro text'
  }
]

const editPage = [
  {
    name: 'no-removal-validator',
    label: 'First name',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'no-removal-validator',
    initialValue: 'John',
    initializeOnMount: true,
    validate: [{ type: racwaValidatorTypes.NO_REMOVAL, message: 'This field can\'t be removed' }]
  },
  {
    name: 'name-validator',
    label: 'First name',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'name-validator',
    validate: [{ type: racwaValidatorTypes.NAME, message: 'Invalid Name', nameType: 'firstName' }]
  },
  {
    name: 'email-validator',
    label: 'Email',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'email-validator',
    validate: [{ type: racwaValidatorTypes.EMAIL, message: 'Invalid email' }]
  },
  {
    name: 'mobile-validator',
    label: 'Mobile',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'mobile-validator',
    validate: [{ type: racwaValidatorTypes.GENERIC_PHONE, message: 'Invalid mobile number', phoneType: 'Mobile' }]
  },
  {
    name: 'landline-validator',
    label: 'Phone',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'landline-validator',
    validate: [{ type: racwaValidatorTypes.GENERIC_PHONE, message: 'Invalid landline', phoneType: 'Landline' }]
  },
  {
    name: 'landline-and-mobile-validator',
    label: 'Phone',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'landline-and-mobile-validator',
    validate: [{ type: racwaValidatorTypes.GENERIC_PHONE, message: 'Invalid phone number', phoneType: 'Both' }]
  },
  {
    component: racwaComponentTypes.WIZARD_SUBMIT_BUTTON,
    name: 'submit',
    label: 'Submit'
  },
  {
    name: 'back',
    label: 'Back',
    component: racwaComponentTypes.WIZARD_BACK_BUTTON
  }
]

export const testSchemaValidators: Schema = {
  fields: [
    {
      component: componentTypes.WIZARD,
      name: 'wizard',
      wizard: EditableFormWizard,
      title: 'Address lookup',
      fields: [
        {
          name: 'display',
          fields: displayPage,
          nextStep: 'edit'
        },
        {
          name: 'edit',
          fields: editPage
        }
      ]
    }
  ]
}
