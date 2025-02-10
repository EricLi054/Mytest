'use client'
import { validatorTypes, type Schema } from '@data-driven-forms/react-form-renderer'
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
    name: 'firstName',
    label: 'First name',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'e.g. John',
    initialValue: 'John',
    initializeOnMount: true,
    validate: [{ type: racwaValidatorTypes.NO_REMOVAL, message: 'This field can\'t be removed' }]
  },
  {
    component: racwaComponentTypes.ADDRESS_INPUT,
    label: 'Address',
    name: 'address',
    tooltipTitle: 'This is my tooltip title',
    tooltipText: 'This is my tooltip text',
    placeholder: 'Enter address',
    refineFurtherMessage: 'Enter more information to narrow down your search.',
    notFoundMessage: 'Address was not found.',
    apiErrorMessage: 'We are unable to search for addresses at the moment. Please try again later.',
    validate: [
      { type: validatorTypes.REQUIRED, message: 'This field is required' },
      { type: racwaValidatorTypes.ADDRESS_VALIDATION, message: 'Your address cannot be validated. Please try again later.' }
    ]
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

export const testSchemaAddressLookup: Schema = {
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
