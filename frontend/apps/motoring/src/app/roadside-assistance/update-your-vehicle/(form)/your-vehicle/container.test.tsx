import { render, screen } from "@testing-library/react";
import { mockYourVehicleContentfulData } from "#mocks/mockContentful";
import { describe, expect, it, vi } from "vitest";

import { YourVehicleContainer } from "./container";

// Imported server action in form.tsx also imports server-only code
vi.mock("server-only", () => ({}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    useFormStatus: vi.fn().mockReturnValue({ pending: false }),
  };
});

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  };
});

describe("YourVehicleContainer", () => {
  it("should be able to render", () => {
    render(<YourVehicleContainer contentfulData={mockYourVehicleContentfulData} />);

    expect(screen.getByText(mockYourVehicleContentfulData.heading)).toBeVisible();
  });
});
