import { act, render, screen } from '@testing-library/react'
import PolicyDetailsCard, { type PolicyDetailsCardContent } from './PolicyDetailsCard'
import { useMediaQuery } from '@mui/material'
import userEvent from '@testing-library/user-event'
import { logEvent } from '@/utilities/analyticsTagging'

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn().mockReturnValue(false)
}))

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}))

describe('PolicyDetailsCard', () => {
  const mockData: PolicyDetailsCardContent = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    type: 'RSA',
    alerts: [
      { severity: 'info', message: 'Info Message' },
      { severity: 'warning', message: 'Warning Message' },
      { severity: 'error', message: 'Error Message' },
      { severity: 'info', message: 'Phone Number:{13 17 03|tel:13 17 03}' }
    ],
    policyItems: [
      { label: 'Item 1', value: 'Value 1' },
      { label: 'Item 2', value: 'Value 2' }
    ],
    actions: [
      { label: 'Action 1', type: 'primary' },
      { label: 'Action 2', type: 'secondary' }
    ]
  }

  it('renders the mobile version', async() => {
    ((useMediaQuery as unknown) as jest.Mock).mockReturnValue(true)
    render(<PolicyDetailsCard data={mockData} />)

    const title = screen.getByText('Test Title')
    const action = screen.getByText('Action 1')
    const warning = screen.getByText('Warning Message')
    const phoneLink = screen.getByText('13 17 03')

    expect(title).toBeInTheDocument()
    expect(warning).toBeInTheDocument()
    expect(action).toBeInTheDocument()
    expect(phoneLink).toBeInTheDocument()

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Info Message')).toBeInTheDocument()
    expect(screen.getByText('Error Message')).toBeInTheDocument()
    expect(screen.getByText('Phone Number:')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Value 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Value 2')).toBeInTheDocument()
    expect(screen.getByText('Action 2')).toBeInTheDocument()

    expect(title.compareDocumentPosition(warning as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(4)
    expect(action.compareDocumentPosition(warning as Node) & Node.DOCUMENT_POSITION_PRECEDING).toBe(2)

    await act(async() => { await userEvent.click(action) })
    expect(jest.mocked(logEvent)).toHaveBeenCalled()
  })
  it('renders the desktop version', async() => {
    ((useMediaQuery as unknown) as jest.Mock).mockReturnValue(false)

    render(<PolicyDetailsCard data={mockData} />)
    const title = screen.getByText('Test Title')
    const action = screen.getByText('Action 1')
    const warning = screen.getByText('Warning Message')
    const phoneLink = screen.getByText('13 17 03')

    expect(title).toBeInTheDocument()
    expect(warning).toBeInTheDocument()
    expect(action).toBeInTheDocument()
    expect(phoneLink).toBeInTheDocument()

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Info Message')).toBeInTheDocument()
    expect(screen.getByText('Error Message')).toBeInTheDocument()
    expect(screen.getByText('Phone Number:')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Value 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Value 2')).toBeInTheDocument()
    expect(screen.getByText('Action 2')).toBeInTheDocument()

    expect(title.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(4)
    expect(action.compareDocumentPosition(warning) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(4)

    await act(async() => { await userEvent.click(phoneLink) })
    expect(jest.mocked(logEvent)).toHaveBeenCalled()
  })

  it("doesn't render actions if not provided", () => {
    const data = { ...mockData, actions: [] }
    render(<PolicyDetailsCard data={data} />)

    expect(screen.queryByText('Action 1')).toBeNull()
    expect(screen.queryByText('Action 2')).toBeNull()
  })

  it("doesn't render alerts if not provided", () => {
    const data = { ...mockData, alerts: [] }
    render(<PolicyDetailsCard data={data} />)

    expect(screen.queryByText('Info Message')).toBeNull()
    expect(screen.queryByText('Warning Message')).toBeNull()
    expect(screen.queryByText('Error Message')).toBeNull()
    expect(screen.queryByText('13 17 03')).toBeNull()
  })
  it("doesn't render policy items if not provided", () => {
    const data = { ...mockData, policyItems: [] }
    render(<PolicyDetailsCard data={data} />)

    expect(screen.queryByText('Item 1')).toBeNull()
    expect(screen.queryByText('Value 1')).toBeNull()
    expect(screen.queryByText('Item 2')).toBeNull()
    expect(screen.queryByText('Value 2')).toBeNull()
  })
  it('renders a word tooltip and tests the open / close', async() => {
    const data = {
      ...mockData,
      policyItems: mockData.policyItems
        ? mockData.policyItems.slice(0, 1).map((item) => ({
          ...item,
          paymentFrequency: {
            title: 'Payment frequency',
            preMessage: 'paying',
            frequency: 'Monthly',
            message: 'Your nominated Card is debited Monthly',
            linkText: 'Change direct debit payment frequency',
            link: '/myrac/change-frequency?phhid=1234'
          }
        }))
        : []
    }
    render(<PolicyDetailsCard data={data} />)

    const tooltip = screen.getByText('Monthly')
    expect(tooltip).toBeInTheDocument()

    await act(async() => { await userEvent.click(tooltip) })

    expect(screen.getByText('Your nominated Card is debited Monthly')).toBeVisible()

    const closeButton = screen.getByRole('button', { name: 'close' })
    await act(async() => { await userEvent.click(closeButton) })

    expect(closeButton).not.toBeVisible()

    expect(jest.mocked(logEvent)).toHaveBeenCalled()
  })
  it('renders a property tooltip and tests the open / close', async() => {
    const data = {
      ...mockData,
      policyItems: mockData.policyItems
        ? mockData.policyItems.slice(0, 1).map((item) => ({
          ...item,
          tooltip: {
            title: 'Repayment Method',
            message: 'The repayment amount is the amount that appears on your loan contract and does not include any outstanding payments. Please contact {RAC Finance|tel:13 17 03} for further details.'
          }
        }))
        : []
    }
    const result = render(<PolicyDetailsCard data={data} />)

    const tooltip = result.container.querySelector('[aria-label="show tooltip"]')
    expect(tooltip).toBeInTheDocument()

    await act(async() => { await userEvent.click(tooltip as Element) })

    expect(screen.getByText('Repayment Method')).toBeVisible()

    const closeButton = screen.getByRole('button', { name: 'close' })
    await act(async() => { await userEvent.click(closeButton) })

    expect(closeButton).not.toBeVisible()

    expect(jest.mocked(logEvent)).toHaveBeenCalled()
  })
})
