import { render } from '@testing-library/react'
import ErrorPage from '@/app/error'
import { signIn } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}))
const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    }
  }
}))

describe('Not Found', () => {
  it('renders error page', async() => {
    render(<ErrorPage error={new Error()} reset={() => null} />)
    expect(pushMock).toHaveBeenCalledWith('/error')
  })
  it('renders error page and redirects to sign in', async() => {
    render(<ErrorPage error={new Error('Unauthorized')} reset={() => null} />)
    expect(jest.mocked(signIn)).toHaveBeenCalled()
  })
})
