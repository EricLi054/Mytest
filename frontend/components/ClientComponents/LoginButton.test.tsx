import LoginButton, { getTitleLink, getMenuLinks } from './LoginButton';
import { type UserMenuProps } from '@/types/cmsTypes/UserMenuProps';
import { render, screen } from '@testing-library/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { testHelper } from '@/__tests__/helpers/testHelpers';

jest.mock('../../utilities/analyticsTagging', () => ({
  logNavClick: jest.fn()
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn()
}));
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    };
  }
}));
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    delete: jest.fn()
  }))
}));

const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: 'test-email@test.com' }
};

const mockUserMenu: UserMenuProps = {
  menuItems: {
    items: [
      {
        longLinkText: 'Title',
        shortLinkText: 'Title',
        linkUrl: '/',
        googleAnalyticsDescription: 'Title GA event'
      },
      {
        longLinkText: 'Link 1',
        shortLinkText: 'Link 1',
        linkUrl: '/1',
        googleAnalyticsDescription: 'Link 1 GA event'
      },
      {
        longLinkText: 'Link 2',
        shortLinkText: 'Link 2',
        linkUrl: '/2',
        googleAnalyticsDescription: 'Link 2 GA event'
      }
    ]
  },
  userMenuText: { sys: { id: '1' } },
  userFullName: { sys: { id: '1' } }
};

describe('LoginButton', () => {
  it('should get the title link from a list of links', async () => {
    const result = getTitleLink(mockUserMenu.menuItems.items);
    expect(result.props.href).toEqual('/');
  });
  it('should get the menu links from a list of links', async () => {
    const result = getMenuLinks(mockUserMenu.menuItems.items);
    expect(result.length).toEqual(2);
    expect(result[0].key).toEqual('/1');
    expect(result[1].key).toEqual('/2');
  });
  it('should render the login button unauthenticated', async () => {
    jest.mocked(useSession).mockReturnValue({ data: null, status: 'unauthenticated', update: jest.fn() });
    render(<LoginButton userMenu={mockUserMenu} />);

    await testHelper.clickButton('Log in', screen);
    expect(jest.mocked(signIn)).toHaveBeenCalled();
  });
  it('should render the login button authenticated', async () => {
    jest.mocked(useSession).mockReturnValue({ data: mockSession, status: 'authenticated', update: jest.fn() });
    render(<LoginButton userMenu={mockUserMenu}>Name</LoginButton>);

    await testHelper.clickText('Name', screen);

    const title = screen.getByText('Title');
    const link1 = screen.getByText('Link 1');
    const link2 = screen.getByText('Link 2');

    expect(title).toHaveAttribute('href', '/');
    expect(link1).toHaveAttribute('href', '/1');
    expect(link2).toHaveAttribute('href', '/2');

    await testHelper.clickButton('Log out', screen);

    expect(jest.mocked(signOut)).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });
  it('should trigger GA navClick event when click on title link when authenticated', async () => {
    jest.mocked(useSession).mockReturnValue({ data: mockSession, status: 'authenticated', update: jest.fn() });
    render(<LoginButton userMenu={mockUserMenu}>Name</LoginButton>);

    await testHelper.clickText('Name', screen);

    testHelper.verifyNavClickLogged('myRAC - First name dropdown');

    await testHelper.clickLink('Title', screen);

    testHelper.verifyNavClickLogged('Title GA event');
  });
  it('should trigger GA navClick event when click when authenticated', async () => {
    jest.mocked(useSession).mockReturnValue({ data: mockSession, status: 'authenticated', update: jest.fn() });
    render(<LoginButton userMenu={mockUserMenu}>Name</LoginButton>);

    await testHelper.clickText('Name', screen);

    testHelper.verifyNavClickLogged('myRAC - First name dropdown');

    await testHelper.clickLink('Link 1', screen);

    testHelper.verifyNavClickLogged('Link 1 GA event');
  });
});
