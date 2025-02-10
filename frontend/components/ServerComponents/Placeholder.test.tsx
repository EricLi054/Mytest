import Placeholder from './Placeholder';
import { getComponent } from '@/graphql/getComponent';

jest.mock('../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}));
jest.mock('../../utilities/auth/ensureServerSession', () => jest.fn());
jest.mock('../../graphql/getPerson', () => jest.fn());
jest.mock('../../graphql/getUnmaskedAddress', () => jest.fn());
jest.mock('../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));
jest.mock('../../graphql/getDigitalCardDetails', () => jest.fn());

describe('Placeholder', () => {
  it('when no Placeholder component found it throws error', async () => {
    const placeholderData = {
      __type: 'Placeholder',
      placeholderType: 'NotFoundComponent'
    };
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(placeholderData));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await Placeholder({ data: { sys: { id: '1', placeholderType: 'NotFoundComponent' } } });

    expect(console.error).toHaveBeenCalledWith(
      'Error: PlaceHolder.tsx Component not found for placeholderType: ',
      'NotFoundComponent'
    );
  });
});
