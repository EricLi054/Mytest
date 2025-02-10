import { useDeviceDetection } from '@/components/ClientComponents/Hooks/useDeviceDetection';
import { logEvent, logNavClick } from '@/utilities/analyticsTagging';
import { act, type Screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const testHelper = {
  clickButton: async (name: string, screen: Screen) => {
    const button = screen.getByRole('button', { name });
    await act(async () => {
      await userEvent.click(button);
    });
  },

  clickLink: async (name: string, screen: Screen) => {
    const link = screen.getByRole('link', { name });
    await act(async () => {
      await userEvent.click(link);
    });
  },

  clickText: async (text: string, screen: Screen) => {
    const element = screen.getByText(text);
    await act(async () => {
      await userEvent.click(element);
    });
  },

  clickTestId: async (testId: string, screen: Screen) => {
    const element = screen.getByTestId(testId);
    await act(async () => {
      await userEvent.click(element);
    });
  },

  clickElement: async (element: HTMLElement) => {
    await act(async () => {
      await userEvent.click(element);
    });
  },

  inputOTPCode: async (otpInput: string, screen: Screen) => {
    for (let index = 0; index < otpInput.length; index++) {
      const digitInput = screen.getByTestId(`input-otp-${index}`);
      await act(async () => {
        await userEvent.type(digitInput, otpInput[index]);
      });
    }
  },

  verifyEventLogged: (description: string) => {
    expect(logEvent).toHaveBeenCalledWith(description);
  },

  verifyNavClickLogged: (description: string) => {
    expect(logNavClick).toHaveBeenCalledWith(description);
  },

  mockConsole: () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    return { log, warn, error };
  },

  mockDesktopDevice: () => {
    jest.mocked(useDeviceDetection).mockReturnValue({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
      isAndroid: false,
      isApple: false
    });
  },

  mockMobileDevice: () => {
    jest.mocked(useDeviceDetection).mockReturnValue({
      isDesktop: false,
      isTablet: false,
      isMobile: true,
      isAndroid: true,
      isApple: false
    });
  }
};
