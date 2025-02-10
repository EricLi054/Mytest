import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DropdownButton, { type DropdownButtonProps } from './DropdownButton'
import { logEvent } from '@/utilities/analyticsTagging'

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}))

describe('DropdownButton', () => {
  it('should render and open a dropdown button', async() => {
    const dropdownProps: DropdownButtonProps = {
      primaryLabel: 'Manage',
      menuItems: [
        {
          label: 'First Item',
          link: '/'
        }
      ]
    }
    render(
        <DropdownButton primaryLabel={dropdownProps.primaryLabel} menuItems={dropdownProps.menuItems}>
            Manage
        </DropdownButton>
    )

    const dropdown = screen.getByText('Manage')
    await act(async() => { await userEvent.click(dropdown) })

    const firstLink = screen.getByText('First Item')
    expect(firstLink).toBeVisible()

    await act(async() => { await userEvent.click(firstLink) })

    expect(jest.mocked(logEvent)).toHaveBeenCalledTimes(2)
  })
})
