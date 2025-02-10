import { getServerSession } from 'next-auth'
import ensureValidSession from './ensureServerSession'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))

describe('ensureServerSession', () => {
  test('resolves with valid server session', async() => {
    jest.mocked(getServerSession).mockImplementation(async() => await Promise.resolve({}))
  })
  test('rejects and throws error without', async() => {
    jest.mocked(getServerSession).mockImplementation(async() => await Promise.resolve(null))
    await expect(ensureValidSession()).rejects.toThrow(
      'Unauthorized'
    )
  })
})
