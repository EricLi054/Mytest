import { render } from '@testing-library/react'
import Home from '@/app/page'

describe('Home', () => {
  it('renders a target', () => {
    const result = render(<Home />)
    const target = result.container.querySelector('#test-target')
    expect(target).toBeInTheDocument()
  })
})
