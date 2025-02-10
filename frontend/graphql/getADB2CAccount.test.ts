import { getServerSession } from 'next-auth';
import getData from './getData';
import { type ADB2CAccount } from '@/types/backendTypes/adb2cAccount';
import getADB2CAccount from './getADB2CAccount';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

jest.mock('../utilities/getAccessToken', () => ({
  getAccessToken: async () => '1234'
}));

jest.mock('./getData', () => jest.fn());

// Write a test using Jest
test('should return a person', async () => {
  const mockAccount: ADB2CAccount = {
    crmId: '1234'
  };

  jest.mocked(getServerSession).mockReturnValue(Promise.resolve('12345'));
  jest.mocked(getData).mockReturnValue(Promise.resolve({ adb2CGraph: mockAccount }));
  const data = await getADB2CAccount();

  // Assert the expected behavior
  expect(data).toEqual(mockAccount);
});

test('should return unauthorised if no session', async () => {
  jest.mocked(getServerSession).mockReturnValue(Promise.resolve(null));

  await expect(getADB2CAccount()).rejects.toThrow('Unauthorized');
});
