import requestPhysicalCard, {
  type RequestPhysicalCardResponse,
  type RequestPhysicalCardMutationResponse
} from './requestPhysicalCard';
import getData from './getData';

jest.mock('./getData', () => jest.fn());

describe('Request physical card mutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can make request successfully', async () => {
    const mutationResponse: RequestPhysicalCardMutationResponse = {
      requestPhysicalCard: {
        physicalCardResponse: {
          value: 'Physical card request successful',
          isSuccess: true,
          errors: []
        }
      }
    };

    const expectedResponse: RequestPhysicalCardResponse = {
      physicalCardResponse: {
        value: 'Physical card request successful',
        isSuccess: true,
        errors: []
      }
    };

    jest.mocked(getData).mockReturnValue(Promise.resolve(mutationResponse));

    const result = await requestPhysicalCard('crmId', 'jwtToken');
    expect(result).toEqual(expectedResponse);
  });

  it('throws error when no data', async () => {
    const mutationResponse: RequestPhysicalCardMutationResponse = {
      requestPhysicalCard: undefined
    };

    jest.mocked(getData).mockReturnValue(Promise.resolve(mutationResponse));

    await expect(requestPhysicalCard('crmId', 'jwtToken')).rejects.toThrow(
      'Error: request physical card failed with no result'
    );
  });
});
