import { getServerSession } from 'next-auth';
import getData from './getData';
import getUnmaskedAddress, { UnmaskedAddressResponse } from './getUnmaskedAddress';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

jest.mock('../utilities/getAccessToken', () => ({
  getAccessToken: async () => '1234'
}));

jest.mock('./getData', () => jest.fn());

test('should return an unmasked address', async () => {
  const mockAddress: UnmaskedAddressResponse = {
    unmaskedPostalAddress: {
      formattedAddress: '123 Fake Str'
    }
  };

  jest.mocked(getServerSession).mockReturnValue(Promise.resolve('12345'));
  jest.mocked(getData).mockReturnValue(Promise.resolve(mockAddress));
  const data = await getUnmaskedAddress();
  console.log('Hello Data', data);

  expect(data).toEqual(mockAddress.unmaskedPostalAddress);
});

test('should return unauthorised if no session', async () => {
  jest.mocked(getServerSession).mockReturnValue(Promise.resolve(null));

  await expect(getUnmaskedAddress()).rejects.toThrow('Unauthorized');
});
