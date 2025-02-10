// GTM.test.js

import { logPageView } from '@/utilities/analyticsTagging';
import { render, screen } from '@testing-library/react';
import GTM from './GTM';
import { usePathname } from 'next/navigation';

jest.mock('../utilities/analyticsTagging', () => ({
  logPageView: jest.fn()
}));

jest.mock('@next/third-parties/google', () => ({
  GoogleTagManager: ({ gtmId }: { gtmId: string }) => {
    return <p>{gtmId}</p>;
  }
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

describe('GTM', () => {
  it('should render initially and not fire a virtual page view', () => {
    jest.mocked(usePathname).mockReturnValue('Initial Path');
    render(<GTM gtmId={'123'} />);
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(logPageView).toHaveBeenCalledTimes(0);
  });
  it('should fire virtual page view on pathname change when already initialised', () => {
    jest.mocked(usePathname).mockReturnValue('Initial Path');
    const { rerender } = render(<GTM gtmId={'123'} />);

    jest.mocked(usePathname).mockReturnValue('Changed Path');
    rerender(<GTM gtmId={'123'} />);
    expect(logPageView).toHaveBeenCalledTimes(1);
  });
});
