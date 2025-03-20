import type { RenderResult } from "@testing-library/react";
import type { Mock } from "vitest";
import { usePathname } from "next/navigation";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EMPTY_URL } from "#constants";
import { expectGtmCustomEvent } from "#testing/analytics";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RacwaThemeProvider } from "@racwa/react-components";

import type { StepperLayoutProps } from ".";
import StepperLayout from ".";

// Mocking the window.scrollTo method to avoid test errors
Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

const yourVehiclePath = "/roadside-assistance/update-your-vehicle/your-vehicle";
const updateVehiclePath = "/roadside-assistance/update-your-vehicle/update-vehicle";
const confirmVehiclePath = "/roadside-assistance/update-your-vehicle/confirm-vehicle";
const confirmationPath = "/roadside-assistance/update-your-vehicle/confirmation";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: () => ({
    push: mockPush,
  }),
}));

const defaultProps = {
  racHomepageUrl: EMPTY_URL,
  entitlementsUrl: EMPTY_URL,
} as const satisfies StepperLayoutProps;

const initialise = (): RenderResult => {
  return render(
    <RacwaThemeProvider>
      <StepperLayout {...defaultProps}>Test Children</StepperLayout>
    </RacwaThemeProvider>,
  );
};

describe("StepperLayout", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should be able to render", () => {
    (usePathname as Mock).mockReturnValue(yourVehiclePath);

    initialise();

    expect(screen.getByRole("heading", { name: "Update Your Vehicle" })).toBeVisible();
    expect(screen.getByText("Test Children")).toBeVisible();
    expect(screen.getByText("Your Vehicle")).toBeVisible();
    expect(screen.getByText("Update Vehicle")).toBeVisible();
    expect(screen.getByText("Confirm Vehicle")).toBeVisible();
    expect(screen.getByText("Confirmation")).toBeVisible();
    expect(screen.getByRole("link", { name: "myRAC" })).toBeVisible();
    expect(screen.getByText("Update your vehicle")).toBeVisible();
  });

  it('should handle "Your Vehicle" step click correctly', async () => {
    (usePathname as Mock).mockReturnValue(updateVehiclePath);
    const user = userEvent.setup();
    initialise();

    const step = screen.getByText("Your Vehicle");
    await user.click(step);

    expect(mockPush).toHaveBeenCalledWith(yourVehiclePath);
  });

  it('should handle "Update Vehicle" step click correctly', async () => {
    (usePathname as Mock).mockReturnValue(confirmVehiclePath);
    const user = userEvent.setup();
    initialise();

    const step = screen.getByText("Update Vehicle");
    await user.click(step);

    expect(mockPush).toHaveBeenCalledWith(updateVehiclePath);
  });

  it('should not attempt to navigate "Confirm Vehicle" step click correctly when already on confirmation path', async () => {
    (usePathname as Mock).mockReturnValue(confirmationPath);
    const user = userEvent.setup();
    initialise();

    const step = screen.getByText("Confirm Vehicle");
    await user.click(step);

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should display the roadside assistance entitlements link and handles click", async () => {
    const user = userEvent.setup();
    initialise();
    const entitlementsLink = screen.getByRole("link", { name: "Roadside Assistance Entitlements" });

    expect(entitlementsLink).toBeVisible();

    await user.click(entitlementsLink);
    expectGtmCustomEvent("Roadside Assistance Entitlements");
  });
});
