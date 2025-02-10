'use client'
import { type Schema } from '@data-driven-forms/react-form-renderer'
import componentTypes from '@data-driven-forms/react-form-renderer/component-types'
import { EditableFormWizard } from './dynamic-components/Wizard/EditableFormWizard'
import racwaComponentTypes from './dynamic-components/racwaComponentTypes'

const displayPage = [
  {
    component: racwaComponentTypes.RICH_TEXT,
    name: 'intro text',
    richText: {
      json: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: 'Rich text component',
                marks: [],
                data: {}
              }
            ]
          },
          {
            nodeType: 'paragraph',
            data: {},
            content: [
              {
                nodeType: 'text',
                value: ' ',
                marks: [],
                data: {}
              }
            ]
          }
        ]
      }
    }
  }
]

export const testSchemaRichText: Schema = {
  fields: [
    {
      component: componentTypes.WIZARD,
      name: 'wizard',
      wizard: EditableFormWizard,
      title: 'Rich Text',
      fields: [
        {
          name: 'display',
          fields: displayPage
        }
      ]
    }
  ]
}
