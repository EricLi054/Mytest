import ensureValidSession from '@/utilities/auth/ensureServerSession';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import requestPhysicalCard from '@/graphql/requestPhysicalCard';
import requestPhysicalCardHandler from './requestPhysicalCardHandler';
import { getCrmId } from '@/utilities/getCrmId';

jest.mock('../../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}));

jest.mock('../../../utilities/getCrmId', () => ({
  getCrmId: jest.fn()
}));

jest.mock('../../../graphql/requestPhysicalCard', () => jest.fn());

jest.mock('../../../utilities/auth/ensureServerSession', () => jest.fn());

testHelper.mockConsole();

describe('Request Physical Card Handler', () => {
  it('returns the expected response for valid request', async () => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve());
    jest.mocked(getCrmId).mockReturnValueOnce(Promise.resolve('crmId'));
    jest.mocked(requestPhysicalCard).mockReturnValueOnce(
      Promise.resolve({
        errors: undefined,
        physicalCardResponse: {
          isSuccess: true,
          errors: null,
          value: 'Physical card request successful'
        }
      })
    );

    const expectedResponse = {
      ok: true,
      data: {
        physicalCardResponse: {
          isSuccess: true,
          errors: null,
          value: 'Physical card request successful'
        }
      }
    };

    const res = await requestPhysicalCardHandler();
    expect(res).toEqual(expectedResponse);
  });

  it('returns failed response if no crmId in session', async () => {
    jest.mocked(getCrmId).mockReturnValueOnce(Promise.resolve(undefined));

    const expectedResponse = {
      ok: false,
      message: 'No crmId found in session'
    };

    const res = await requestPhysicalCardHandler();
    expect(res).toEqual(expectedResponse);
  });

  it('returns failed response if unable to fetch data', async () => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve());
    jest.mocked(getCrmId).mockReturnValueOnce(Promise.resolve('crmId'));
    jest.mocked(requestPhysicalCard).mockReturnValueOnce(Promise.resolve(null));

    const expectedResponse = {
      ok: false,
      message: 'Error sending data'
    };

    const res = await requestPhysicalCardHandler();
    expect(res).toEqual(expectedResponse);
  });

  it('returns failed response if API returns bad request', async () => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve());
    jest.mocked(getCrmId).mockReturnValueOnce(Promise.resolve('crmId'));
    jest.mocked(requestPhysicalCard).mockReturnValueOnce(
      Promise.resolve({
        physicalCardResponse: undefined,
        errors: [
          {
            errorCode: 'BadRequest',
            message: 'Bad Request'
          }
        ]
      })
    );

    const expectedResponse = {
      ok: false,
      data: {
        physicalCardResponse: undefined,
        errors: [
          {
            errorCode: 'BadRequest',
            message: 'Bad Request'
          }
        ]
      }
    };

    const res = await requestPhysicalCardHandler();
    expect(res).toEqual(expectedResponse);
  });
});
