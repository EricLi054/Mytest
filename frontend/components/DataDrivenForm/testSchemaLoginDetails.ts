'use client'
import { type Schema } from '@data-driven-forms/react-form-renderer'
import componentTypes from '@data-driven-forms/react-form-renderer/component-types'
import { EditableFormWizard } from './dynamic-components/Wizard/EditableFormWizard'
import racwaComponentTypes from './dynamic-components/racwaComponentTypes'

const editPage = [
  {
    name: 'email',
    component: racwaComponentTypes.REDIRECT_EDIT,
    variant: 'h6',
    label: 'Log-in email',
    content: '{{ person.loginEmail }}',
    link: 'https://rac.com.au/api/oidc/updateemail'
  },
  {
    component: racwaComponentTypes.DIVIDER,
    name: 'divider-1'
  },
  {
    name: 'password',
    component: racwaComponentTypes.REDIRECT_EDIT,
    variant: 'h6',
    label: 'Password',
    content: '**********',
    link: 'https://rac.com.au/api/oidc/updatepassword'
  },
  {
    name: 'back',
    label: 'Back',
    component: racwaComponentTypes.WIZARD_BACK_BUTTON
  }
]

const displayPage = [
  {
    component: componentTypes.SELECT,
    label: 'Title',
    options: [
      {
        value: 'Mr',
        label: 'Mr'
      },
      {
        value: 'Mrs',
        label: 'Mrs'
      },
      {
        value: 'Miss',
        label: 'Miss'
      },
      {
        value: 'Ms',
        label: 'Ms'
      },
      {
        value: 'Mx',
        label: 'Mx'
      },
      {
        value: 'Dr',
        label: 'Dr'
      }
    ],
    name: 'name-dropdown'
  }
]

export const testSchemaLoginDetails: Schema = {
  fields: [
    {
      component: componentTypes.WIZARD,
      name: 'wizard',
      wizard: EditableFormWizard,
      title: 'Log-in details',
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
