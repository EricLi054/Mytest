import getHeader from './getHeader';

const mockedGet = jest.fn();
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: mockedGet
  }))
}));

describe('getHeader', () => {
  test('get header', async () => {
    mockedGet.mockReturnValueOnce('test-header');
    const res = await getHeader('Header');
    expect(res).toEqual('test-header');
  });
  test("doesn't have cookie", async () => {
    mockedGet.mockReturnValueOnce(null);
    const res = await getHeader('Header');
    expect(res).toBeNull();
  });
});
