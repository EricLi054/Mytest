import { render } from '@testing-library/react'
import ProductCardSkeleton from './ProductCardSkeleton'

describe('Product Card Skeleton', () => {
  it('renders the loading skeleton', () => {
    const result = render(<ProductCardSkeleton />)
    const root = result.container.querySelector('.MuiGrid-root.MuiGrid-container')
    const body = result.container.querySelector('.MuiSkeleton-root.MuiSkeleton-text.MuiSkeleton-pulse')
    expect(root).toBeInTheDocument()
    expect(body).toBeInTheDocument()
  })
})
