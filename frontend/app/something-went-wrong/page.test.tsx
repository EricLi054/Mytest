// app/something-went-wrong/page.test.tsx

import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { themeOptions } from '@racwa/react-components'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import SomethingWentWrongPage from './page'

library.add(faPhone)

describe('NotFound component', () => {
  it('renders GenericErrorPage', () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <SomethingWentWrongPage />
      </ThemeProvider>
    )

    // Check if error message is rendered
    const errorMessageElement = screen.getByText(/Something went wrong/i)
    expect(errorMessageElement).toBeInTheDocument()
  })
})
