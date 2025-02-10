import ensureValidSession from '@/utilities/auth/ensureServerSession'
import personUpdateHandler from './personUpdateHandler'
import updatePerson from '@/graphql/updatePerson'
import { testHelper } from '@/__tests__/helpers/testHelpers'

jest.mock('../../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}))

jest.mock('../../../graphql/updatePerson', () => jest.fn())

jest.mock('../../../utilities/auth/ensureServerSession', () => jest.fn())

testHelper.mockConsole()

describe('Person Update Handler', () => {
  it('successful update', async() => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve())
    jest.mocked(updatePerson).mockReturnValueOnce(Promise.resolve({
      data: {
        updatePerson: {
          firstName: 'John',
          dateOfBirth: '01/01/1980'
        }
      }
    }))

    const mockInput = {
      firstName: 'John',
      dateOfBirth: '01/01/1980'
    }

    const expectedOutput = {
      ok: true,
      data: {
        data: {
          updatePerson: {
            firstName: 'John',
            dateOfBirth: '01/01/1980'
          }
        }
      }
    }

    const res = await personUpdateHandler(mockInput)
    expect(res).toEqual(expectedOutput)
  })
  it('fails if server session is bad', async() => {
    jest.mocked(ensureValidSession).mockRejectedValue(() => { throw new Error('Unauthorized') })
    const mockInput = {
      firstName: 'John',
      dateOfBirth: '01/01/1980'
    }
    await expect(personUpdateHandler(mockInput)).rejects.toThrow(
      'Unauthorized'
    )
  })
  it('error sending', async() => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve())
    jest.mocked(updatePerson).mockReturnValueOnce(Promise.resolve(null))

    const mockInput = {
      firstName: 'John'
    }

    const expectedOutput = {
      ok: false,
      message: 'Error sending data'
    }

    const res = await personUpdateHandler(mockInput)
    expect(res).toEqual(expectedOutput)
  })
})
