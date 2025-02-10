import ComponentSwitcher from '@/components/ServerComponents/ComponentSwitcher';

jest.mock('../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}));
jest.mock('../../utilities/auth/ensureServerSession', () => jest.fn());
jest.mock('../../graphql/getContactDetailsMetadata', () => jest.fn());
jest.mock('../../graphql/getNameMetadata', () => jest.fn());
jest.mock('../../graphql/getPerson', () => jest.fn());
jest.mock('../../graphql/getUnmaskedAddress', () => jest.fn());
jest.mock('../../graphql/getDigitalCardDetails', () => jest.fn());

describe('ComponentSwitcher', () => {
  it('invalid json throws error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await ComponentSwitcher({ component: { __typename: 'Something' } });

    expect(console.error).toHaveBeenCalledWith('Error: ComponentSwitcher.tsx Component not found: ', 'Something');
  });
});
