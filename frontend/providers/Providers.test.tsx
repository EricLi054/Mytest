// Providers.test.js

import { render } from '@testing-library/react'
import Providers from './Providers'

describe('Providers', () => {
  it('should render its children properly', () => {
    const { getByText } = render(
      <Providers session={null}>Mocked Children</Providers>
    )
    expect(getByText('Mocked Children')).toBeInTheDocument()
  })

  // Add more test cases as needed
})
