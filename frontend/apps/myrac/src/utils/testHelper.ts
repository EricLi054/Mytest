import type { Screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDeviceDetection } from "#components/shared/useDeviceDetection";
import { clientEnv } from "#env/client";
import { expect, vi } from "vitest";

import { logNavClick } from "./analyticsTagging";

export const testHelper = {
  clickButton: async (name: string, screen: Screen) => {
    const button = screen.getByRole("button", { name });
    await userEvent.click(button);
  },

  clickLink: async (name: string, screen: Screen) => {
    const link = screen.getByRole("link", { name });
    await userEvent.click(link);
  },

  clickText: async (text: string, screen: Screen) => {
    const element = screen.getByText(text);
    await userEvent.click(element);
  },

  clickTestId: async (testId: string, screen: Screen) => {
    const element = screen.getByTestId(testId);
    await userEvent.click(element);
  },

  clickElement: async (element: HTMLElement) => {
    await userEvent.click(element);
  },

  verifyNavClickLogged: (description: string) => {
    expect(logNavClick).toHaveBeenCalledWith(description);
  },

  mockDesktopDevice: () => {
    vi.mocked(useDeviceDetection).mockReturnValue({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
      isAndroid: false,
      isApple: false,
    });
  },

  mockMobileDevice: () => {
    vi.mocked(useDeviceDetection).mockReturnValue({
      isDesktop: false,
      isTablet: false,
      isMobile: true,
      isAndroid: true,
      isApple: false,
    });
  },
  mockEnvironmentVariableProvider: () => {
    vi.mock("server-only", () => ({}));
    vi.mock("#providers/environmentVariables/context", () => ({
      useEnvironmentVariables: vi.fn(() => {
        return clientEnv();
      }),
    }));
  },
};
