import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FooterSearchBar from './FooterSearchBar'

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    }
  }
}))

describe('FooterSearchBar', () => {
  it('should route to search page after click', async() => {
    render(<FooterSearchBar placeholderText='Test' />)
    const searchInput = screen.getByPlaceholderText<HTMLInputElement>('Test')
    const searchButton = screen.getByRole('button', { name: 'Search' })

    await act(async() => { await userEvent.type(searchInput, 'example') })
    await act(async() => { await userEvent.click(searchButton) })

    expect(pushMock).toHaveBeenCalledWith('/search#/searchresult?query=example')
  })
})
