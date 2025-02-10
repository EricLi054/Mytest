import RootLayout from '@/app/layout';
import { act, render, screen } from '@testing-library/react';
import { getServerSession } from 'next-auth/next';
import { type PropsWithChildren } from 'react';
import fetchMock from 'jest-fetch-mock';
import FontAwesomeIcon from '@/components/ClientComponents/FontAwesomeIcon';
import { testHelper } from '../helpers/testHelpers';

fetchMock.enableMocks();
testHelper.mockConsole();

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    };
  },
  usePathname: jest.fn()
}));

jest.mock('@mui/material-nextjs/v14-appRouter', () => ({
  AppRouterCacheProvider: ({ children }: PropsWithChildren) => {
    return <>{children}</>;
  }
}));

jest.mock('@next/third-parties/google', () => ({
  GoogleTagManager: ({ gtmId }: { gtmId: string }) => {
    return <p>GTM Script</p>;
  }
}));

jest.mock('../../components/ClientComponents/OTPBypassBanner', () => {
  const OTPBypassBanner = () => <div>OTPBypassBanner</div>;
  return OTPBypassBanner;
});

describe('Layout', () => {
  it('renders layout', async () => {
    jest.mocked(getServerSession).mockImplementation(async () => await Promise.resolve({}));
    const { container } = await act(async () =>
      render(
        <>
          {await RootLayout({
            children: (
              <>
                <p>Test</p>
                <FontAwesomeIcon icon='copy' />
              </>
            )
          })}
        </>
      )
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(container.querySelector('.fa-copy')).toBeInTheDocument();
    expect(screen.getByText('GTM Script')).toBeInTheDocument();
    expect(screen.getByText('OTPBypassBanner')).toBeInTheDocument();
  });
});
