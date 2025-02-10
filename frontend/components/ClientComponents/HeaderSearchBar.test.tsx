import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeaderSearchBar from '@/components/ClientComponents/HeaderSearchBar'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

library.add(faSearch)

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    }
  }
}))

describe('HeaderSearchBar', () => {
  it('should update the search term when input value changes', async() => {
    render(<HeaderSearchBar placeholder="Search" />)

    const inputElement = screen.getByPlaceholderText<HTMLInputElement>('Search')
    const searchButton = screen.getByRole('button')

    await act(async() => { await userEvent.type(inputElement, 'example') })
    await act(async() => { await userEvent.click(searchButton) })

    expect(pushMock).toHaveBeenCalledWith('/search#/searchresult?query=example')
  })
})
