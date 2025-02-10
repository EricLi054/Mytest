import { render, screen } from '@testing-library/react'
import getData from '@/graphql/getData'
import { ThemeProvider, createTheme } from '@mui/material'
import { themeOptions } from '@racwa/react-components'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Error from '@/app/error/page'

library.add(fas)

jest.mock('../../utilities/getAccessToken', () => jest.fn())
jest.mock('../../graphql/getData', () => jest.fn())

describe('Error', () => {
  it('renders custom error page with no cms data', () => {
    jest.mocked(getData).mockReturnValue(Promise.resolve(null))
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <Error />
      </ThemeProvider>
    )
    const target = screen.getByText(/Uh oh!/i)
    expect(target).toBeInTheDocument()
  })
})
