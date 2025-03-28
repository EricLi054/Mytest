import { useActionState } from "react";
import { render, screen } from "@testing-library/react";
import { mockYourVehicleContentfulData } from "#mocks/contentful";
import { useFormStatus } from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { YourVehicleContainer } from "./container";

vi.mock("server-only", () => ({}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

describe("YourVehicleContainer", () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
    vi.mocked(useFormStatus).mockReturnValue({ pending: false, data: null, method: null, action: null });
  });

  it("should be able to render", () => {
    render(<YourVehicleContainer contentfulData={mockYourVehicleContentfulData} />);

    expect(screen.getByText(mockYourVehicleContentfulData.heading)).toBeVisible();
  });
});
