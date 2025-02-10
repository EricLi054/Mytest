import MustacheImage from './MustacheImage';
import { getComponent } from '@/graphql/getComponent';

jest.mock('../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}));
jest.mock('../../utilities/auth/ensureServerSession', () => jest.fn());
jest.mock('../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));

describe('MustacheImage', () => {
  it('returns empty fragment when no image template', async () => {
    const data = {
      title: 'Member card',
      imageIdTemplate: null,
      altTemplate: null,
      borderRadius: 3
    };
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(data));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await MustacheImage({ data: { sys: { id: '1' } } });

    expect(console.error).toHaveBeenCalledWith('Error: MustacheImage.tsx no imageIdTemplate for:', 'Member card');
  });
});
