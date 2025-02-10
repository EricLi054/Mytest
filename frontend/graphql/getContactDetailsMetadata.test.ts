import { getServerSession } from 'next-auth'
import getContactDetailsMetadata from './getContactDetailsMetadata'
import getData from './getData'
import { type PersonInformation } from '@/types/backendTypes/personInformation'

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}))

jest.mock('../utilities/getAccessToken', () => ({
  getAccessToken: async() => '1234'
}))

jest.mock('./getData', () => jest.fn())

process.env = {
  NODE_ENV: 'test',
  INSURANCE_B2C_URL: 'test_url'
}

// Write a test using Jest
test('should return a person and B2C Url', async() => {
  const mockPerson: PersonInformation = {
    homePhone: '1234',
    mobilePhone: '1234',
    personalEmailAddress: '',
    workPhone: '',
    postalAddress: { formattedAddress: '' }
  }

  jest.mocked(getServerSession).mockReturnValue(Promise.resolve('12345'))
  jest.mocked(getData).mockReturnValue(Promise.resolve({ person: mockPerson }))
  const data = await getContactDetailsMetadata()

  // Assert the expected behavior
  expect(data.person).toEqual(mockPerson)
  expect(data.b2cUrl).toEqual('test_url')
})

test('should return unauthorised if no session', async() => {
  jest.mocked(getServerSession).mockReturnValue(Promise.resolve(null))

  await expect(getContactDetailsMetadata()).rejects.toThrow(
    'Unauthorized'
  )
})
