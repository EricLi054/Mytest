import { act, render, screen, waitFor } from '@testing-library/react'
import { LoadingProvider } from './LoadingProvider'
import { useLoadingContext } from './LoadingContext'
import { Button } from '@mui/material'
import userEvent from '@testing-library/user-event'

jest.useFakeTimers()

const TestButton = () => {
  const { openLoadingIndicator, closeLoadingIndicator } = useLoadingContext()

  return (
          <Button onClick={() => {
            openLoadingIndicator()
            setTimeout(() => {
              closeLoadingIndicator()
            }, 1000)
          }}>
              Open
          </Button>
  )
}

describe('Loading Screen', () => {
  it('should not work when not wrapped in provider', async() => {
    render(
                <>
                  <TestButton />
                </>
    )
    const openButton = screen.getByRole('button', { name: 'Open' })
    // require this workaround due to fake timers causing the click to not work properly
    const user = userEvent.setup({ delay: null })
    await act(async() => {
      await user.click(openButton)
    })
    expect(screen.queryByTestId('loading-modal')).not.toBeInTheDocument()
  })
  it('should render in a closed state', async() => {
    render(
        <LoadingProvider>
          <TestButton />
        </LoadingProvider>
    )
    expect(screen.queryByTestId('loading-modal')).not.toBeVisible()
  })
  it('should open and close the loading screen', async() => {
    render(
        <LoadingProvider>
          <TestButton />
        </LoadingProvider>
    )
    const openButton = screen.getByRole('button', { name: 'Open' })

    // require this workaround due to fake timers causing the click to not work properly
    const user = userEvent.setup({ delay: null })
    await act(async() => {
      await user.click(openButton)
    })
    expect(screen.getByTestId('loading-modal')).toBeVisible()

    act(() => { jest.runAllTimers() })
    await waitFor(() => { expect(screen.queryByTestId('loading-modal')).not.toBeVisible() })
  })
})
