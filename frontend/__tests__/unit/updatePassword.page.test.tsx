import { render, waitFor } from '@testing-library/react';
import UpdatePassword from '@/app/oidc/updatePassword/page';
import { useSession } from 'next-auth/react';
import React from 'react';
import { getADB2CUpdatePasswordUrl } from '../../utilities/adb2c';

const pushMock = jest.fn();
const getMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    };
  },
  useSearchParams: () => {
    return {
      get: getMock
    };
  }
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));

jest.mock('../../utilities/adb2c', () => ({
  getADB2CUpdatePasswordUrl: jest.fn()
}));

// need a mock session to test the page even though it isn't used
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: 'test-email@test.com' }
};

describe('UpdatePassword', () => {
  it('redirect to adb2c url', async () => {
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() });
    jest.mocked(getADB2CUpdatePasswordUrl).mockReturnValue(Promise.resolve('/adb2c/updatePassword'));

    getMock.mockReturnValueOnce(null);

    render(<UpdatePassword />);

    expect(useSession).toHaveBeenCalled();
    expect(getADB2CUpdatePasswordUrl).toHaveBeenCalled();
  });
  it('redirect to adb2c url couldn\t get url', async () => {
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() });
    jest.mocked(getADB2CUpdatePasswordUrl).mockReturnValue(Promise.reject(new Error('')));
    console.error = jest.fn();

    getMock.mockReturnValueOnce(null);

    render(<UpdatePassword />);

    expect(useSession).toHaveBeenCalled();
    expect(getADB2CUpdatePasswordUrl).toHaveBeenCalled();
  });
  it('password updated successfully', async () => {
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() });

    getMock.mockReturnValueOnce('/myrac/profile/contact-details');

    render(<UpdatePassword />);

    expect(useSession).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });
  it('should have a title', async () => {
    const updateMock = jest.fn();
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: updateMock });

    getMock.mockReturnValueOnce('/myrac/profile/contact-details');
    getMock.mockReturnValueOnce('code');
    render(<UpdatePassword />);
    await waitFor(() => {
      expect(document.title).toBe('myRAC');
    });
  });
  // TODO: Add test for ADB2C failure
});
