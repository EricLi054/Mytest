import { testHelper } from '@/__tests__/helpers/testHelpers'
import updatePerson from './updatePerson'
import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

testHelper.mockConsole()

describe('Update Person GraphQL', () => {
  it('successful submit', async() => {
    const fetchResponse = {
      data: {
        updatePerson: {
          title: 'Mr',
          firstName: 'John',
          middleName: null,
          surname: 'Smith'
        }
      }
    }
    fetchMock.mockResponseOnce(JSON.stringify(fetchResponse))

    const mockInput = {
      firstName: 'John'
    }

    const res = await updatePerson(mockInput)
    expect(res).toEqual(fetchResponse)
  })
})
