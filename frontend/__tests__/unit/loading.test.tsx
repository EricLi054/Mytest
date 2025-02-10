import { render } from '@testing-library/react'
import Loading from '@/app/loading'

describe('Loading', () => {
  it('renders loading modal', async() => {
    const result = render(<Loading />)
    const target = result.container.querySelector('[data-icon="spinner"]')
    expect(target).toBeInTheDocument()
  })
})
