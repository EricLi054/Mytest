import { type Document } from '@contentful/rich-text-types'

export interface RichTextProps {
  json: Document
  links?: Links
}

export interface Links {
  entries: {
    inline: Entry[]
  }
}

export interface Entry {
  sys: {
    id: string
  }
  __typename: string
  template?: string
  advancedTemplate?: string
  defaultValue?: string
}
