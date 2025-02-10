import Signin from '@/app/signIn/page'
import { render, waitFor } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/react'
import checkHasCookie from '@/utilities/checkHasCookie'

const pushMock = jest.fn()
const getMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    }
  },
  useSearchParams: () => {
    return {
      get: getMock
    }
  }
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn()
}))

jest.mock('../../utilities/checkHasCookie', () => jest.fn())

// need a mock session to test the page even though it isn't used
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: 'test-email@test.com' }
}

describe('Sign In', () => {
  beforeAll(() => {
    getMock.mockClear()
  })
  it('authenticated on both with callback url', async() => {
    getMock.mockReturnValueOnce(null) // get error
    getMock.mockReturnValueOnce('/myrac/test') // get callback
    getMock.mockReturnValueOnce(null) // get refresh
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() })
    jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true))

    render(<Signin />)

    expect(useSession).toHaveBeenCalled()
    expect(jest.mocked(checkHasCookie)).toHaveBeenCalled()
    await waitFor(() => { expect(pushMock).toHaveBeenCalledWith('/myrac/test') })
  })
  it('authenticated on both with no callback url', async() => {
    getMock.mockReturnValue(null) // no search params
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() })
    jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true))

    render(<Signin />)

    expect(useSession).toHaveBeenCalled()
    expect(jest.mocked(checkHasCookie)).toHaveBeenCalled()
    await waitFor(() => { expect(pushMock).toHaveBeenCalledWith('/myrac') })
  })
  it('authenticated on next on non-rac domain', async() => {
    getMock.mockReturnValue(null) // no search params
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() })
    jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(false))

    render(<Signin />)

    expect(useSession).toHaveBeenCalled()
    expect(jest.mocked(checkHasCookie)).toHaveBeenCalled()
    await waitFor(() => { expect(pushMock).toHaveBeenCalledWith('/myrac') })
  })
  it('authenticated on both but needs to refresh after find my products', async() => {
    getMock.mockReturnValueOnce(null) // get error
    getMock.mockReturnValueOnce('/myrac/test') // get callback
    getMock.mockReturnValueOnce(true) // get refresh
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() })
    jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true))

    render(<Signin />)

    expect(useSession).toHaveBeenCalled()
    expect(jest.mocked(checkHasCookie)).toHaveBeenCalled()
    await waitFor(() => { expect(jest.mocked(signIn)).toHaveBeenCalledWith('azure-ad-b2c', { callbackUrl: '/myrac/test' }) })
  })
  it('unauthenticated and logged in to sitecore with callback set', async() => {
    getMock.mockReturnValueOnce(null) // get error
    getMock.mockReturnValueOnce('/myrac/test') // get callback
    getMock.mockReturnValueOnce(null) // get refresh
    jest.mocked(useSession).mockReturnValueOnce({ data: null, status: 'unauthenticated', update: jest.fn() })
    jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true))

    render(<Signin />)

    expect(useSession).toHaveBeenCalled()
    expect(jest.mocked(checkHasCookie)).toHaveBeenCalled()
    await waitFor(() => { expect(jest.mocked(signIn)).toHaveBeenCalledWith('azure-ad-b2c', { callbackUrl: '/myrac/test' }) })
  })
  it('unauthenticated and logged in to sitecore with callback not set', async() => {
    getMock.mockReturnValue(null) // no search params
    jest.mocked(useSession).mockReturnValueOnce({ data: null, status: 'unauthenticated', update: jest.fn() })
    jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true))

    render(<Signin />)

    expect(useSession).toHaveBeenCalled()
    expect(jest.mocked(checkHasCookie)).toHaveBeenCalled()
    await waitFor(() => { expect(jest.mocked(signIn)).toHaveBeenCalledWith('azure-ad-b2c', { callbackUrl: '/myrac' }) })
  })
  it('has a title of Log In to RAC WA', async() => {
    getMock.mockReturnValueOnce(null)
    jest.mocked(useSession).mockReturnValueOnce({ data: null, status: 'unauthenticated', update: jest.fn() })
    jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(true))
    render(<Signin />)
    await waitFor(() => { expect(document.title).toBe('Log In to RAC WA') })
  })
  // TODO: Fix below tests by figuring out how to mock window object
  //   it('authenticated on next on rac domain', async() => {
  //     jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() })
  //     jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(false))

  //     render(<Signin />)

  //     expect(useSession).toHaveBeenCalled()
  //     expect(jest.mocked(checkHasCookie)).toHaveBeenCalled()
  //     await waitFor(() => { expect(pushMock).toHaveBeenCalledWith('/api/oidc/SignIn') })
  //   })
  // it('unauthenticated on sitecore and on nextjs on rac domain', async() => {
  //   jest.mocked(useSession).mockReturnValueOnce({ data: null, status: 'unauthenticated', update: jest.fn() })
  //   jest.mocked(checkHasCookie).mockReturnValueOnce(Promise.resolve(false))

  //   render(<Signin />)

  //   expect(useSession).toHaveBeenCalled()
  //   expect(jest.mocked(checkHasCookie)).toHaveBeenCalled()
  //   await waitFor(() => { expect(jest.mocked(signIn)).toHaveBeenCalled() })
  //   // await waitFor(() => { expect(pushMock).toHaveBeenCalledWith('/api/oidc/SignIn') })
  // })
})
