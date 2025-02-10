import { render } from '@testing-library/react'
import Custom404 from '@/app/not-found'
import getData from '@/graphql/getData'
import { ThemeProvider, createTheme } from '@mui/material'
import { themeOptions } from '@racwa/react-components'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

jest.mock('../../utilities/getAccessToken', () => jest.fn())
jest.mock('../../graphql/getData', () => jest.fn())

describe('Not Found', () => {
  it('renders custom 404 page with no cms data', async() => {
    jest.mocked(getData).mockReturnValue(Promise.resolve(null))
    const result = render(
      <ThemeProvider theme={createTheme(themeOptions)}>
      <>{await Custom404()}</>
      </ThemeProvider>)
    const target = await result.findByText('404')
    expect(target).toBeInTheDocument()
  })
})
