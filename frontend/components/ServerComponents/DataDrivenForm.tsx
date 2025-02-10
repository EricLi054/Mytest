import { getComponent } from '@/graphql/getComponent'
import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps'
import { DataDrivenForm } from '../DataDrivenForm/DataDrivenForm'
import { EditableFormWizard } from '../DataDrivenForm/dynamic-components/Wizard/EditableFormWizard'
import componentTypes from '../DataDrivenForm/dynamic-components/componentTypes'
import { getAccessToken } from '@/utilities/getAccessToken'
import defaultValidatorTypes from '../DataDrivenForm/validators/validatorTypes'
import { MFAJourneyKeys } from '../ClientComponents/MFA/Types/MFAJourneyKeys'

interface DataDrivenFormProps extends ComponentSwitchableProps {}

const fields = `
  __typename
  title
  shortTitle
  visibilityCondition
  pages: pagesCollection {
    items {
      name
      requiresMfaToProceed
      fields: fieldsCollection {
        items {
          name
          component
          label
          fixedLabelWidth
          helperText
          placeholder
          tooltipTitle
          tooltipText
          required
          requiredMessage
          initialValue
          selectOptions
          richText {
            json
          }
          successText {
            json
          }
          errorText {
            json
          }
          validators: validatorsCollection {
            items {
              validatorType
              message
              pattern
              nameType
              phoneType
              maxAge,
              minAge,
              ageOutOfRangeMessage
            }
          }
          conditionalLogic
          extraData
        }
      }
      nextStep {
        name
      }
    }
  }
`

const generateSchema = (data: any) => {
  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: 'wizard',
        wizard: EditableFormWizard,
        title: data.title,
        shortTitle: data.shortTitle,
        fields: data.pages?.items.map((page: any) => {
          return {
            name: page.name,
            nextStep: page.nextStep?.name,
            requiresMfaToProceed: page?.requiresMfaToProceed || false,
            fields: page.fields?.items.map((field: any) => {
              return {
                name: field.name,
                component: field.component,
                label: field.label,
                helperText: field.helperText,
                tooltipTitle: field.tooltipTitle,
                tooltipText: field.tooltipText,
                required: field.required,
                placeholder: field.placeholder,
                validate: [
                  ...(field.required
                    ? [
                        {
                          type: defaultValidatorTypes.REQUIRED,
                          message: field.requiredMessage ?? undefined
                        }
                      ]
                    : []),
                  ...(field.validators?.items
                    ? field.validators?.items.map((validator: any) => {
                      return {
                        type: validator.validatorType,
                        message: validator.message ?? undefined,
                        pattern: validator.pattern ?? undefined,
                        nameType: validator.nameType ?? undefined,
                        phoneType: validator.phoneType ?? undefined,
                        maxAge: validator.maxAge ?? undefined,
                        minAge: validator.minAge ?? undefined,
                        ageOutOfRangeMessage:
                            validator.ageOutOfRangeMessage ?? undefined
                      }
                    })
                    : [])
                ],
                ...(field.conditionalLogic
                  ? { condition: field.conditionalLogic }
                  : {}),
                ...(field.selectOptions
                  ? {
                      options: field.selectOptions.map((value: string) => {
                        return { value }
                      })
                    }
                  : {}),
                ...(field.richText ? { richText: field.richText } : {}),
                ...(field.successText
                  ? { successText: field.successText }
                  : {}),
                ...(field.errorText ? { errorText: field.errorText } : {}),
                initialValue: field.initialValue,
                initializeOnMount: true,
                ...(field.fixedLabelWidth
                  ? { fixedLabelWidth: field.fixedLabelWidth }
                  : {}),
                ...field.extraData
              }
            })
          }
        })
      }
    ]
  }
}

export default async function ContentfulDataDrivenForm(
  props: DataDrivenFormProps
) {
  const { data } = props
  const token = await getAccessToken()
  const resultData = await getComponent(
    'dataDrivenForm',
    data.sys.id,
    fields,
    true,
    token,
    MFAJourneyKeys.manageContact // TODO - this should be dynamic
  )
  const schema = generateSchema(resultData)

  // if visibility condition has not been set we default to showing, and if it has it must come to be true
  if (
    resultData.visibilityCondition === null ||
    resultData.visibilityCondition === 'true'
  ) {
    return <DataDrivenForm schema={schema} />
  } else return undefined
}
