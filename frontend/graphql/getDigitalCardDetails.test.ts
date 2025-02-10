import { getServerSession } from 'next-auth';
import getData from './getData';
import getDigitalCardDetails from './getDigitalCardDetails';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

jest.mock('../utilities/getAccessToken', () => ({
  getAccessToken: async () => '1234'
}));

jest.mock('./getData', () => jest.fn());

// Write a test using Jest
test('should return a digital card details', async () => {
  const mockedCardDetails: DigitalCardDetails = {
    isSuccess: true,
    value: {
      digitalCardPassId: '12345',
      digitalCardPassIsActive: true,
      digitalCardPassUrl: 'https://digital-card-link',
      numberOfPassesInstalled: 0
    },
    errors: null
  };

  const mockedCardDetailsData = {
    digitalCardDetails: mockedCardDetails
  };

  jest.mocked(getServerSession).mockReturnValue(Promise.resolve('12345'));
  jest.mocked(getData).mockReturnValue(Promise.resolve(mockedCardDetailsData));
  const details = await getDigitalCardDetails();

  // Assert the expected behavior
  expect(details).toEqual(mockedCardDetails);
});

test('should return unauthorised if no session', async () => {
  jest.mocked(getServerSession).mockReturnValue(Promise.resolve(null));

  await expect(getDigitalCardDetails()).rejects.toThrow('Unauthorized');
});

test('should log error if no digital card details', async () => {
  jest.mocked(getServerSession).mockReturnValue(Promise.resolve('12345'));
  jest.mocked(getData).mockReturnValue(Promise.resolve(undefined));
  jest.spyOn(console, 'error').mockImplementation(() => {});

  const details = await getDigitalCardDetails();
  expect(details).toBeUndefined();

  expect(console.error).toHaveBeenCalledWith('Error: retrieve digital card details failed with no result');
});
