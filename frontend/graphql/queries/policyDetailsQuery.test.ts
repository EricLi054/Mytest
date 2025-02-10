import getData from '../getData'; // Adjust the path
import { MFAJourneyKeys } from '@/components/ClientComponents/MFA/Types/MFAJourneyKeys';
import policyDetailsQuery from './policyDetailsQuery';

// Mock getData to simulate the GraphQL query result
jest.mock('../getData', () => jest.fn());

describe('policyDetailsQuery', () => {
  const mockSessionKey = MFAJourneyKeys.manageContact;
  const mockToken = 'mock-token';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return member products if data is fetched successfully', async () => {
    // Mock the data returned by getData
    const mockData = {
      memberProducts: [
        {
          registrationNumber: '123ABC',
          subtitle: 'Test Subtitle',
          subtitleSecondary: 'Secondary Subtitle',
          title: 'Test Policy',
          type: 'ROAD',
          typename: 'PolicyDetailsCard',
          actions: [],
          alerts: [],
          policyItems: []
        }
      ]
    };
    (getData as jest.Mock).mockResolvedValue(mockData);

    const result = await policyDetailsQuery(mockToken);

    // Assert that the result contains the member products data
    expect(result).toEqual(mockData.memberProducts);
    expect(getData).toHaveBeenCalledTimes(1);
    expect(getData).toHaveBeenCalledWith(expect.any(String), mockToken, expect.any(Object));
  });

  it('should handle error if memberProducts is not found', async () => {
    // Mock the data returned by getData to return null or undefined
    const mockData = {};
    (getData as jest.Mock).mockResolvedValue(mockData);

    const result = await policyDetailsQuery(mockToken);

    // Assert that the result is undefined or empty since memberProducts doesn't exist
    expect(result).toBeUndefined();
    expect(getData).toHaveBeenCalledTimes(1);
  });

  it('should log an error if no memberProducts are returned', async () => {
    // Mock console.error to track error logs
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const mockData = {}; // Empty data to simulate error
    (getData as jest.Mock).mockResolvedValue(mockData);

    await policyDetailsQuery(mockToken);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: policyDetailQuery failed with no member products');
    consoleErrorSpy.mockRestore(); // Cleanup the spy
  });

  it('should call getData with correct parameters', async () => {
    // Mock the data to return a valid response
    const mockData = {
      memberProducts: [
        {
          registrationNumber: '123ABC',
          subtitle: 'Test Subtitle',
          subtitleSecondary: 'Secondary Subtitle',
          title: 'Test Policy',
          type: 'ROAD',
          typename: 'PolicyDetailsCard',
          actions: [],
          alerts: [],
          policyItems: []
        }
      ]
    };
    (getData as jest.Mock).mockResolvedValue(mockData);

    // Call the policyDetailsQuery
    await policyDetailsQuery(mockToken);

    // Check that getData was called with the correct parameters
    expect(getData).toHaveBeenCalledWith(
      expect.any(String),
      mockToken,
      expect.objectContaining({
        sessionKey: mockSessionKey
      })
    );
  });
});
