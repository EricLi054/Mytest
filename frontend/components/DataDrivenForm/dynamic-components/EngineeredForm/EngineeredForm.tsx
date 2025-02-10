import { EditContactDetailsFormStep2 } from '../../engineered-forms/EditContactDetailsForm'
import { EditNameFormStep2 } from '../../engineered-forms/EditNameForm'

const keyMap: Record<string, any> = {
  EditContactDetailsFormStep2,
  EditNameFormStep2
}

export const EngineeredForm = (props: any) => {
  const Form = keyMap[props.name]

  if (!Form) {
    console.error('Error: EngineeredForm.tsx Form not found: ', props.name)
    return undefined
  }

  return <Form />
}
