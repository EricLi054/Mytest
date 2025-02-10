import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps'
import ContentfulRichTextRenderer from './ContentfulRichTextRenderer'
import { getComponent } from '@/graphql/getComponent'

interface TypographyProps extends ComponentSwitchableProps { }

const fields = `
  title
  text {
    json
    links {
      entries {
        inline {
          __typename
          sys {
            id
          }
        }
      }
    }
  }
`

async function Typography(props: TypographyProps): Promise<React.JSX.Element> {
  const { data } = props

  const resultData = await getComponent('typography', data.sys.id, fields, true)

  return (
    <ContentfulRichTextRenderer text={resultData.text} />
  )
}

export default Typography
