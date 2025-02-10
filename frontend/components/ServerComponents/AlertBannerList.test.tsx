import { render, screen } from '@testing-library/react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { type BannerAlertProps } from '@/types/cmsTypes/BannerAlertProps'
import { BLOCKS } from '@contentful/rich-text-types'
import AlertBannerList from './AlertBannerList'
import { getComponent } from '@/graphql/getComponent'
import { ThemeProvider, createTheme } from '@mui/material'
import { themeOptions } from '@racwa/react-components'

library.add(faExclamationTriangle)

jest.mock('../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}))

describe('AlertBannerList', () => {
  it('should render a list of banners', async() => {
    const bannerAlert1: BannerAlertProps = {
      title: 'Banner 1',
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
                  value: 'This is an alert banner1',
                  marks: [],
                  data: {}
                }
              ]
            }
          ]
        }
      }
    }

    const bannerAlert2: BannerAlertProps = {
      title: 'Banner 2',
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
                  value: 'This is an alert banner2',
                  marks: [],
                  data: {}
                }
              ]
            }
          ]
        }
      }
    }
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve({ banners: { items: [bannerAlert1, bannerAlert2] } }))
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await AlertBannerList(
          {
            data: { sys: { id: '1' } }
          }
        )
        }
      </ThemeProvider>
    )

    expect(screen.getByText('Banner 1')).toBeInTheDocument()
    expect(screen.getByText('This is an alert banner1')).toBeInTheDocument()

    expect(screen.getByText('Banner 2')).toBeInTheDocument()
    expect(screen.getByText('This is an alert banner2')).toBeInTheDocument()
  })
})
