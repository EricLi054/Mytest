import { testHelper } from '@/__tests__/helpers/testHelpers';
import getData from './getData';
import { getComponent } from './getComponent';

testHelper.mockConsole();
jest.mock('./getData', () => jest.fn());

process.env = {
  NODE_ENV: 'test',
  CONTENTFUL_ENVIRONMENT: ''
};

const mockResponse = {
  data: {
    component: {
      __typename: 'Component'
    }
  }
};

const successfulResponse = { contentDataRequest: [JSON.stringify(mockResponse)] };

jest.mocked(getData).mockReturnValue(Promise.resolve(null));

describe('getComponent', () => {
  it('successful fetch molecule unauthenticated', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(successfulResponse));
    const res = await getComponent('componentName', 'componentId', '__typename');
    expect(res.__typename).toBe('Component');
  });
  it('successful fetch molecule authenticated', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(successfulResponse));
    const res = await getComponent('componentName', 'componentId', '__typename', false, 'token');
    expect(res.__typename).toBe('Component');
  });
  it('unsuccessful fetch molecule', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(undefined));
    await expect(getComponent('componentName', 'componentId', '__typename')).rejects.toThrow('No result');
  });
  it('successful fetch atom unauthenticated', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(successfulResponse));
    const res = await getComponent('componentName', 'componentId', '__typename', true);
    expect(res.__typename).toBe('Component');
  });
  it('successful fetch atom authenticated', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(successfulResponse));
    const res = await getComponent('componentName', 'componentId', '__typename', true, 'token');
    expect(res.__typename).toBe('Component');
  });
  it('unsuccessful fetch molecule', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(undefined));
    await expect(getComponent('componentName', 'componentId', '__typename', true)).rejects.toThrow('No result');
  });
});
