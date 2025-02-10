import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider'
import SessionTimeoutProvider from './SessionTimeoutProvider'
import { render, waitFor, screen, act } from '@testing-library/react'
import { getSession, signOut, useSession } from 'next-auth/react'
import { getADB2CLogoutUrl } from '@/utilities/adb2c'
import userEvent from '@testing-library/user-event'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faSpinner)

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    }
  }
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  getSession: jest.fn(),
  signOut: jest.fn()
}))

jest.mock('../utilities/adb2c', () => ({
  getADB2CLogoutUrl: jest.fn()
}))

jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')
jest.spyOn(global, 'clearTimeout')

const mockExpiredSession = {
  expires: (Date.now() - 1000).toString(),
  user: { email: 'test-email@test.com' }
}

const mockLessThan2LeftSession = {
  expires: (Date.now() + (60000 * 1)).toString(),
  user: { email: 'test-email@test.com' }
}

const mockNormalSession = {
  expires: (Date.now() + (60000 * 10)).toString(),
  user: { email: 'test-email@test.com' }
}

describe('Session Timeout Provider', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should logout if session already expired', async() => {
    jest.mocked(useSession).mockReturnValue({ data: mockExpiredSession, status: 'authenticated', update: jest.fn() })
    jest.mocked(getSession).mockReturnValue(Promise.resolve(mockExpiredSession))
    jest.mocked(getADB2CLogoutUrl).mockReturnValue(Promise.resolve('/logout'))
    render(
          <ModalProvider>
            <SessionTimeoutProvider />
          </ModalProvider>
    )
    await waitFor(() => { expect(getSession).toHaveBeenCalled() })
    await waitFor(() => { expect(getADB2CLogoutUrl).toHaveBeenCalled() })
    await waitFor(() => { expect(signOut).toHaveBeenCalled() })
    await waitFor(() => { expect(pushMock).toHaveBeenCalled() })
  })
  it('should show modal immediately if session nearly expired and can refresh token', async() => {
    const updateMock = jest.fn()
    jest.mocked(useSession).mockReturnValue({ data: mockLessThan2LeftSession, status: 'authenticated', update: updateMock })
    jest.mocked(getSession).mockReturnValue(Promise.resolve(mockLessThan2LeftSession))
    render(
          <ModalProvider>
            <SessionTimeoutProvider />
          </ModalProvider>
    )
    await waitFor(() => { expect(getSession).toHaveBeenCalled() })

    // click refresh session
    await waitFor(() => { expect(screen.getByText('OK')).toBeInTheDocument() })

    // require this workaround due to fake timers causing the click to not work properly
    const user = userEvent.setup({ delay: null })
    await act(async() => {
      await user.click(screen.getByText('OK'))
    })

    // check refresh actions have been taken
    await waitFor(() => { expect(updateMock).toHaveBeenCalled() })
  })
  it('should set a timer ready for a modal to appear and another to force us out', async() => {
    jest.mocked(useSession).mockReturnValue({ data: mockNormalSession, status: 'authenticated', update: jest.fn() })
    jest.mocked(getSession).mockReturnValue(Promise.resolve(mockNormalSession))
    render(
          <ModalProvider>
            <SessionTimeoutProvider />
          </ModalProvider>
    )
    await waitFor(() => { expect(getSession).toHaveBeenCalled() })
    await waitFor(() => { expect(setTimeout).toHaveBeenCalled() })

    // runs down timer and checks modal has appeared
    act(() => { jest.advanceTimersByTime(60 * 8 * 1000) })
    await waitFor(() => { expect(screen.getByText('OK')).toBeInTheDocument() })

    // checks we are force logged out after the remaining 2 minutes
    act(() => { jest.advanceTimersByTime(1000 * 60 * 2) })
    await waitFor(() => { expect(getADB2CLogoutUrl).toHaveBeenCalled() })
    await waitFor(() => { expect(signOut).toHaveBeenCalled() })
    await waitFor(() => { expect(pushMock).toHaveBeenCalled() })
  })
})
