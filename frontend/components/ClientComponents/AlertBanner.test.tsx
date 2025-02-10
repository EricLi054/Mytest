import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import AlertBanner from './AlertBanner'
import { type BannerAlertProps } from '@/types/cmsTypes/BannerAlertProps'
import { BLOCKS } from '@contentful/rich-text-types'

library.add(faExclamationTriangle)

describe('AlertBanner', () => {
  it('should render and close an alert banner', async() => {
    const bannerAlert: BannerAlertProps = {
      title: 'myRAC',
      icon: 'exclamation-triangle',
      bodyText: {
        json: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'This is an alert banner',
                  marks: [],
                  data: {}
                }
              ]
            }
          ]
        }
      }
    }
    render(<AlertBanner bannerAlert={bannerAlert} />)

    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
    expect(screen.getByText('myRAC')).toBeInTheDocument()
    expect(screen.getByText('This is an alert banner')).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: 'Close' })
    await act(async() => { await userEvent.click(closeButton) })
  })
})
