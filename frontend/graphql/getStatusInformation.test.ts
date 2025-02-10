import { getServerSession } from 'next-auth';
import getData from './getData';
import getStatusInformation from './getStatusInformation';
import { type StatusInformation } from '@/types/backendTypes/statusInformation';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

jest.mock('../utilities/getAccessToken', () => ({
  getAccessToken: async () => '1234'
}));

jest.mock('./getData', () => jest.fn());

// Write a test using Jest
test('should return a list of status information', async () => {
  const mockInfo: StatusInformation[] = [
    {
      name: 'Person v2',
      status: 'HEALTHY'
    },
    {
      name: 'Finance',
      status: 'DOWN'
    }
  ];

  jest.mocked(getServerSession).mockReturnValue(Promise.resolve('12345'));
  jest.mocked(getData).mockReturnValue(Promise.resolve({ statusInformation: mockInfo }));
  const data = await getStatusInformation();

  // Assert the expected behavior
  expect(data).toEqual(mockInfo);
});

test('should return null if no information returned', async () => {
  jest.mocked(getServerSession).mockReturnValue(Promise.resolve('12345'));
  jest.mocked(getData).mockReturnValue(Promise.resolve({ statusInformation: null }));
  const data = await getStatusInformation();

  // Assert the expected behavior
  expect(data).toBeNull();
});

test('should return unauthorised if no session', async () => {
  jest.mocked(getServerSession).mockReturnValue(Promise.resolve(null));

  await expect(getStatusInformation()).rejects.toThrow('Unauthorized');
});
