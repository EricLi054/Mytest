import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { themeOptions } from '@racwa/react-components'
import ErrorPage from './page'
import { logEvent } from '../../utilities/analyticsTagging'

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}))

describe('Error page', () => {
  it('renders Error Page', () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <ErrorPage />
      </ThemeProvider>
    )

    const headingText = screen.getByText(/Uh oh!/i)
    const subHeadingText = screen.getByText(/Something went wrong/i)
    const contentText = screen.getByText(
      /Please try again later or call us on/i
    )
    const callLink = screen.getByRole('link', { name: /13 17 03/i })
    const myRACLinkButton = screen.getByRole('link', { name: /Back to myRAC/i })

    expect(headingText).toBeVisible()
    expect(subHeadingText).toBeVisible()
    expect(contentText).toBeVisible()
    expect(callLink).toBeVisible()
    expect(callLink).toHaveAttribute('href', 'tel:131703')
    expect(myRACLinkButton).toBeVisible()
    expect(myRACLinkButton).toHaveAttribute('href', '/myRAC')
  })

  it('send GA event when call link is clicked', () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <ErrorPage />
      </ThemeProvider>
    )

    const linkElement = screen.getByRole('link', { name: /13 17 03/i })
    fireEvent.click(linkElement)
    expect(logEvent).toHaveBeenCalledWith('Error page - Call Us')
  })
})
