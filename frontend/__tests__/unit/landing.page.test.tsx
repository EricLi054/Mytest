import LandingPage from '@/app/[...slug]/LandingPage'
import { createTheme, ThemeProvider } from '@mui/material'
import { themeOptions } from '@racwa/react-components'
import { render, screen } from '@testing-library/react'

jest.mock('../../utilities/getAccessToken', () => ({
  getAccessToken: jest.fn()
}))

jest.mock('../../utilities/auth/ensureServerSession', () => jest.fn())
jest.mock('../../graphql/getContactDetailsMetadata', () => jest.fn())
jest.mock('../../graphql/getNameMetadata', () => jest.fn())

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
  useRouter: () => {
    return {
      push: jest.fn()
    }
  }
}))

jest.mock('../../components/ServerComponents/ComponentSwitcher', () => {
  const ComponentSwitcher = (props: { component: any }) => (
    <div>{props.component.__typename}</div>
  )
  return ComponentSwitcher
})

const mockData = {
  data: {
    page: {
      items: [
        {
          content: {
            items: [{ __typename: 'Test 1' }, { __typename: 'Test 2' }]
          }
        }
      ]
    }
  }
}

describe('Landing Page', () => {
  it('renders a loading modal', async() => {
    const params: Readonly<{ pageData: any | undefined }> = {
      pageData: undefined
    }
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await LandingPage(params)}</>
      </ThemeProvider>
    )

    // finds loading spinner image
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })
  it('renders content', async() => {
    const params: Readonly<{ pageData: any | undefined }> = {
      pageData: mockData.data.page.items[0]
    }
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{await LandingPage(params)}</>
      </ThemeProvider>
    )
    expect(screen.getByText('Test 1')).toBeInTheDocument()
    expect(screen.getByText('Test 2')).toBeInTheDocument()
  })
})
