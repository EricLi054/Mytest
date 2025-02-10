// VWO.test.tsx

import { render } from '@testing-library/react'
import VWO from './VWO'

// Mock Next.js Link component with displayName
jest.mock('next/link', () => {
  const MockLink: React.FC<any> = ({ children }) => (
    <div data-testid="mock-link">{children}</div>
  )
  MockLink.displayName = 'NextLink'
  return MockLink
})

// Mock Next.js Script component with displayName
jest.mock('next/script', () => {
  const MockScript: React.FC<any> = ({ children }) => (
    <div data-testid="mock-script">{children}</div>
  )
  MockScript.displayName = 'NextScript'
  return MockScript
})

describe('VWO Component', () => {
  it('renders VWO Script when on RAC domain', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'ractest.com.au' },
      writable: true
    })

    const { getByTestId } = render(<VWO accountId="123456" />)
    const mockScript = getByTestId('mock-script') // Get the mocked script element
    expect(mockScript).toBeInTheDocument()
  })

  it('does not render VWO Script when not on RAC domain', () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'example.com' },
      writable: true
    })

    const { queryByTestId } = render(<VWO accountId="123456" />)
    const mockScript = queryByTestId('mock-script') // Get the mocked script element
    expect(mockScript).not.toBeInTheDocument()
  })
})
