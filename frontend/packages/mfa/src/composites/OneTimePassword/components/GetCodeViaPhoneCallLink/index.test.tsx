import type { FlowValues } from "#composites/OneTimePassword/types/internal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getMockDefaultFlowState } from "#composites/OneTimePassword/testing/mocks";
import { NotAuthenticatedStateFlow } from "#composites/OneTimePassword/types/internal";
import { expectGtmCustomEventWithDescriptionContaining } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import type { GetCodeViaPhoneCallLinkProps } from ".";
import { GetCodeViaPhoneCallLink } from ".";
import { OtpFlowStateProvider } from "../../contexts/OtpFlowState";

const mockDefaultFlowState = getMockDefaultFlowState();

const mockClearOtpInput = vi.fn();

const mockUseFlowState = vi.fn();
const mockSetFlowState = vi.fn();
vi.mock("../../contexts/OtpFlowState", async () => {
  const actual = await vi.importActual("../../contexts/OtpFlowState");
  return {
    ...actual,
    useOtpFlowState: (): { flowState: FlowValues; setFlowState: typeof mockSetFlowState } =>
      mockUseFlowState() as { flowState: FlowValues; setFlowState: typeof mockSetFlowState },
  };
});

type TestProps = Pick<GetCodeViaPhoneCallLinkProps, "clearOtpInput">;
const TestComponent = ({ clearOtpInput }: TestProps) => {
  mockUseFlowState.mockReturnValue({ flowState: mockDefaultFlowState, setFlowState: mockSetFlowState });
  return (
    <OtpFlowStateProvider>
      <GetCodeViaPhoneCallLink idPrefix="test" clearOtpInput={clearOtpInput} />
    </OtpFlowStateProvider>
  );
};

const linkText = "Get code via phone call";
const getLink = () => screen.getByRole("link", { name: linkText });

describe("GetCodeViaPhoneCallLink", () => {
  it("should render", () => {
    render(<TestComponent />);

    expect(getLink()).toBeVisible();
  });

  it("should trigger gtm event on click", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    await user.click(getLink());

    expectGtmCustomEventWithDescriptionContaining(linkText);
  });

  it("should call setFlowState on click", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    await user.click(getLink());

    expect(mockSetFlowState).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockDefaultFlowState,
        selectionStatus: NotAuthenticatedStateFlow.PhoneCallVerificationOption,
      }),
    );
  });

  it("should not call clearOtpInput on click when prop is not defined", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    await user.click(getLink());

    expect(mockClearOtpInput).not.toHaveBeenCalled();
  });

  it("should call clearOtpInput on click when prop is defined", async () => {
    const user = userEvent.setup();
    render(<TestComponent clearOtpInput={mockClearOtpInput} />);

    await user.click(getLink());

    expect(mockClearOtpInput).toHaveBeenCalled();
  });
});
