import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { useFormStatus } from "react-dom";
import { describe, expect, it, vi } from "vitest";

import FormLoadingModal from ".";

vi.mock("react-dom", () => ({
  useFormStatus: vi.fn(() => ({ pending: false })),
}));

describe("LoadingModal", () => {
  it("should render RacwaLoadingModal with props", () => {
    const props = {
      open: true,
      message: "Loading...",
      "data-testid": "backdrop",
    };

    render(<FormLoadingModal {...props} />);

    expect(screen.getByTestId("backdrop")).toBeVisible();
    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("should render RacwaLoadingModal with open status from useFormStatus", () => {
    (useFormStatus as Mock).mockReturnValue({ pending: true });

    const props = {
      open: false,
      message: "Loading...",
      "data-testid": "backdrop",
    };

    render(<FormLoadingModal {...props} />);

    expect(screen.getByTestId("backdrop")).toBeVisible();
    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("should render RacwaLoadingModal with open status from props if useFormStatus is not pending", () => {
    (useFormStatus as Mock).mockReturnValue({ pending: true });

    const props = {
      open: true,
      message: "Loading...",
      "data-testid": "backdrop",
    };

    render(<FormLoadingModal {...props} />);

    expect(screen.getByTestId("backdrop")).toBeVisible();
    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("should not render RacwaLoadingModal when both open prop and useFormStatus are false", () => {
    const props = {
      open: false,
      message: "Loading...",
      "data-testid": "backdrop",
    };

    (useFormStatus as Mock).mockReturnValue({ pending: false });

    render(<FormLoadingModal {...props} />);

    expect(screen.queryByTestId("backdrop")).not.toBeVisible();
    expect(screen.queryByText("Loading...")).not.toBeVisible();
  });

  it("should not render RacwaLoadingModal when open prop is false and useFormStatus is not pending", () => {
    const props = {
      open: false,
      message: "Loading...",
      "data-testid": "backdrop",
    };

    (useFormStatus as Mock).mockReturnValue({ pending: false });

    render(<FormLoadingModal {...props} />);

    expect(screen.queryByTestId("backdrop")).not.toBeVisible();
    expect(screen.queryByText("Loading...")).not.toBeVisible();
  });
});
