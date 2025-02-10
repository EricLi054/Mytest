'use client'
import {
  type Schema,
  validatorTypes
} from '@data-driven-forms/react-form-renderer'
import { EditableFormWizard } from './dynamic-components/Wizard/EditableFormWizard'
import racwaComponentTypes from './dynamic-components/racwaComponentTypes'
import componentTypes from './dynamic-components/componentTypes'
import racwaValidatorTypes from './validators/racwaValidatorTypes'

export const displayPage = [
  {
    component: componentTypes.PLAIN_TEXT,
    label: '{{ person.displayName }}',
    variant: 'h6',
    name: 'intro text'
  }
]

export const editPage = [
  {
    component: 'info-alert',
    name: 'legalName',
    label: 'Please use your legal name',
    description: "As written on your driver's license or passport."
  },
  {
    name: 'fixed-label',
    label: 'Fixed Label',
    component: racwaComponentTypes.FIXED_LABEL_PLAIN_TEXT,
    fixedLabelWidth: '100px'
  },
  {
    name: 'title',
    label: 'Title',
    fullWidth: true,
    required: true,
    component: racwaComponentTypes.BUTTON_SELECT,
    options: [
      {
        value: 'Mr'
      },
      {
        value: 'Mrs'
      },
      {
        value: 'Miss'
      },
      {
        value: 'Ms'
      },
      {
        value: 'Mx'
      },
      {
        value: 'Dr'
      }
    ],

    isRequired: true,
    validate: [{ type: validatorTypes.REQUIRED }]
  },
  {
    name: 'firstName',
    label: 'First name',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'e.g. John',
    tooltipTitle: 'This is my tooltip title',
    tooltipText: 'This is my tooltip text',
    isRequired: true,
    validate: [
      { type: validatorTypes.REQUIRED },
      {
        type: racwaValidatorTypes.NAME,
        message: 'Invalid name',
        nameType: 'firstName'
      }
    ]
  },
  {
    name: 'middleName',
    label: 'Middle name',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'e.g. James',
    isRequired: false,
    helperText: 'Include this if you have one',
    validate: [
      {
        type: racwaValidatorTypes.NAME,
        message: 'Invalid name',
        nameType: 'middleName'
      }
    ]
  },
  {
    name: 'surname',
    label: 'Last name',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'e.g. Smith',
    isRequired: true,
    validate: [
      { type: validatorTypes.REQUIRED },
      {
        type: racwaValidatorTypes.NAME,
        message: 'Invalid name',
        nameType: 'lastName'
      }
    ]
  },
  {
    name: 'mobile',
    label: 'Mobile',
    component: componentTypes.TEXT_FIELD,
    placeholder: 'e.g. 0400 000 000',
    isRequired: true,
    validate: [
      { type: validatorTypes.REQUIRED },
      {
        type: racwaValidatorTypes.GENERIC_PHONE,
        message: 'Invalid mobile number',
        phoneType: 'Mobile'
      }
    ]
  },
  {
    name: 'submit',
    label: 'Update name',
    component: racwaComponentTypes.WIZARD_SUBMIT_BUTTON,
    successTitle: "You've updated your name",
    successButtonText: 'Okay',
    errorTitle: 'Error updating your name',
    errorButtonText: 'Okay'
  },
  {
    name: 'back',
    label: 'Cancel',
    component: racwaComponentTypes.WIZARD_CANCEL_BUTTON,
    modalTitle: 'Are you sure you want to cancel?',
    confirmText: 'Yes, please cancel',
    cancelText: 'No, go back'
  }
]

export const testSchemaFullDetailForm: Schema = {
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
