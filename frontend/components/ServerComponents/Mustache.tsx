import { getComponent } from '@/graphql/getComponent'
import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps'
import { getAccessToken } from '@/utilities/getAccessToken'

interface MustacheProps extends ComponentSwitchableProps { }

const fields = `
  __typename
  name
  template
  textColour {
    hex
  }
  defaultValue
`

async function Mustache(props: MustacheProps) {
  const { data } = props
  const token = await getAccessToken()

  const resultData = await getComponent('mustacheTemplates', data.sys.id, fields, true, token)

  if (resultData.textColour) {
    return <span style={{ color: resultData.textColour.hex, overflowWrap: 'anywhere' }}>{resultData?.template}</span>
  }

  return resultData.template ?? resultData.defaultValue
}

export default Mustache
