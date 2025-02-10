import { render, screen, waitFor } from '@testing-library/react';
import { signOut } from 'next-auth/react';
import Logout from '@/app/oidc/signout/page';
import getHeader from '@/utilities/getHeader';

const baseUrl = 'http://localhost';

jest.mock('next-auth/react', () => ({
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

jest.mock('../../utilities/adb2c', () => ({
  getADB2CLogoutUrl: jest.fn(async () => await Promise.resolve('logout'))
}));

jest.mock('../../utilities/getHeader', () => jest.fn());

describe('Logout Component', () => {
  it('calls signOut on render for external call', async () => {
    jest.mocked(getHeader).mockReturnValueOnce(Promise.resolve('externalUrl.com.au'));
    render(<Logout />);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
  });

  it('calls signOut and navigates to logout page on render for internal call', async () => {
    jest.mocked(getHeader).mockReturnValueOnce(Promise.resolve(baseUrl));
    render(<Logout />);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ redirect: false });
      expect(pushMock).toHaveBeenCalledWith('logout');
    });
  });

  it('renders loading modal', () => {
    render(<Logout />);

    const loadingIndictor = screen.getByRole('img', { hidden: true });

    expect(loadingIndictor).toBeInTheDocument();
  });
});
