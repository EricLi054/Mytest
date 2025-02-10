import { render, waitFor } from '@testing-library/react';
import UpdateEmail from '@/app/oidc/updateEmail/page';
import { useSession } from 'next-auth/react';
import React from 'react';
import { getADB2CUpdateEmailUrl } from '@/utilities/adb2c';

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
  getADB2CUpdateEmailUrl: jest.fn()
}));

// need a mock session to test the page even though it isn't used
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: 'test-email@test.com' }
};

describe('UpdateEmail', () => {
  it('redirect to adb2c url', async () => {
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() });
    jest.mocked(getADB2CUpdateEmailUrl).mockReturnValue(Promise.resolve('/adb2c/updateEmail'));

    getMock.mockReturnValueOnce(null);

    render(<UpdateEmail />);

    expect(useSession).toHaveBeenCalled();
    expect(getADB2CUpdateEmailUrl).toHaveBeenCalled();
  });
  it('redirect to adb2c url failed to get url', async () => {
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: jest.fn() });
    jest.mocked(getADB2CUpdateEmailUrl).mockReturnValue(Promise.reject(new Error('')));
    console.error = jest.fn();

    getMock.mockReturnValueOnce(null);

    render(<UpdateEmail />);

    expect(useSession).toHaveBeenCalled();
    expect(getADB2CUpdateEmailUrl).toHaveBeenCalled();
  });
  it('update email journey cancelled', async () => {
    const updateMock = jest.fn();
    updateMock.mockReturnValueOnce(Promise.resolve());
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: updateMock });

    getMock.mockReturnValueOnce('/myrac/profile/contact-details');

    render(<UpdateEmail />);

    expect(pushMock).toHaveBeenCalled();
  });
  it('updates email address successfully', async () => {
    const updateMock = jest.fn();
    updateMock.mockReturnValueOnce(Promise.resolve());
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: updateMock });

    getMock.mockReturnValueOnce('/myrac/profile/contact-details');
    getMock.mockReturnValueOnce('code');

    render(<UpdateEmail />);

    expect(useSession).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });
  it('updates email address call promise rejected', async () => {
    const updateMock = jest.fn();
    updateMock.mockReturnValueOnce(Promise.reject(new Error('error')));
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: updateMock });

    getMock.mockReturnValueOnce('/myrac/profile/contact-details');
    getMock.mockReturnValueOnce('code');

    console.error = jest.fn();

    render(<UpdateEmail />);

    expect(useSession).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });
  it('should have a title', async () => {
    const updateMock = jest.fn();
    updateMock.mockReturnValueOnce(Promise.reject(new Error('error')));
    jest.mocked(useSession).mockReturnValueOnce({ data: mockSession, status: 'authenticated', update: updateMock });

    getMock.mockReturnValueOnce('/myrac/profile/contact-details');
    getMock.mockReturnValueOnce('code');
    render(<UpdateEmail />);
    await waitFor(() => {
      expect(document.title).toBe('myRAC');
    });
  });
  // TODO: Add test for ADB2C failure
});
