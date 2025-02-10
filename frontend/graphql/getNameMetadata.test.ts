import { getServerSession } from 'next-auth'
import getData from './getData'
import { type PersonInformation } from '@/types/backendTypes/personInformation'
import getNameMetadata from './getNameMetadata'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))

jest.mock('../utilities/getAccessToken', () => ({
  getAccessToken: async() => '1234'
}))

jest.mock('./getData', () => jest.fn())

// Write a test using Jest
test('should return a person', async() => {
  const mockPerson: PersonInformation = {
    title: 'Mr',
    firstName: 'John',
    middleName: '',
    surname: 'Smith'
  }

  jest.mocked(getServerSession).mockReturnValue(Promise.resolve('12345'))
  jest.mocked(getData).mockReturnValue(Promise.resolve({ person: mockPerson }))
  const data = await getNameMetadata()

  // Assert the expected behavior
  expect(data.person).toEqual(mockPerson)
})

test('should return unauthorised if no session', async() => {
  jest.mocked(getServerSession).mockReturnValue(Promise.resolve(null))

  await expect(getNameMetadata()).rejects.toThrow(
    'Unauthorized'
  )
})
