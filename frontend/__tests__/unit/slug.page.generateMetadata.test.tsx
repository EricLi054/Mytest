import { generateMetadata } from '@/app/[...slug]/page';
import getData from '../../graphql/getData';

jest.mock('../../utilities/getAccessToken', () => jest.fn());
jest.mock('../../graphql/getData', () => jest.fn());
const mockLandingPageMetaData = {
  data: {
    page: {
      items: [
        {
          metaData: { title: 'myRAC', description: 'myRAC' }
        }
      ]
    }
  }
};
const mockErrorPageMetaData = {
  data: {
    errorPage: {
      items: [
        {
          metaData: { title: 'error', description: 'error' }
        }
      ]
    }
  }
};
jest.mock('../../utilities/auth/ensureServerSession', () => jest.fn());
jest.mock('../../graphql/getContactDetailsMetadata', () => jest.fn());
jest.mock('../../graphql/getNameMetadata', () => jest.fn());
jest.mock('../../graphql/getPerson', () => jest.fn());
jest.mock('../../graphql/getUnmaskedAddress', () => jest.fn());
jest.mock('../../graphql/getDigitalCardDetails', () => jest.fn());
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

describe('Slug Page Generate Metadata', () => {
  it('generates metadata landing page', async () => {
    jest
      .mocked(getData)
      .mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockLandingPageMetaData)] }));
    const result = await generateMetadata({ params: { slug: ['myrac'] } });
    expect(result).toEqual(mockLandingPageMetaData.data.page.items[0].metaData);
  });
  it('generates metadata error page', async () => {
    jest
      .mocked(getData)
      .mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify(mockErrorPageMetaData)] }));
    const result = await generateMetadata({ params: { slug: ['error'] } });
    expect(result).toEqual(mockErrorPageMetaData.data.errorPage.items[0].metaData);
  });
  it('generates default metadata if data not retrieved', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve(undefined));
    const result = await generateMetadata({ params: { slug: ['myrac'] } });
    expect(result).toEqual({ title: 'myRAC' });
  });
  it('generates default metadata if cms data is empty', async () => {
    jest.mocked(getData).mockReturnValueOnce(Promise.resolve({ contentDataRequest: [JSON.stringify({ data: '' })] }));
    const result = await generateMetadata({ params: { slug: ['myrac'] } });
    expect(result).toEqual({ title: 'myRAC' });
  });
});
