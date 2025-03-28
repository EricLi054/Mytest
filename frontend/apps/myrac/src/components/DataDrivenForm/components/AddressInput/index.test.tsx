import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import { TestFormRenderer } from "../../testHelper";
import { searchAddress, validateSelectedAddress } from "./util";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");

vi.mock("./util", () => ({
  searchAddress: vi.fn(),
  validateSelectedAddress: vi.fn(),
}));

const testNoInitialValueSchema = [
  {
    name: "postalAddress",
    component: "address-input",
    label: "Mailing address",
    tooltipTitle: "tooltipTitle",
    tooltipText: "tooltipText",
    required: true,
    placeholder: "placeholder",
    apiErrorMessage: "apiErrorMessage",
    notFoundMessage: "notFoundMessage",
    refineFurtherMessage: "refineFurtherMessage",
  },
];

describe("Address Input Component", () => {
  it("should render with basic elements (label, placeholder, tooltip)", async () => {
    render(<TestFormRenderer fields={testNoInitialValueSchema} />);

    expect(screen.getByText("Mailing address")).toBeVisible();

    const input = screen.getByRole("combobox");

    expect(input).toHaveAttribute("placeholder", "placeholder");
    expect(input).toHaveValue("");

    await testHelper.clickButton("show tooltip", screen);

    expect(screen.getByText("tooltipTitle")).toBeVisible();
  });

  it("should show refineFurtherMessage", async () => {
    render(<TestFormRenderer fields={testNoInitialValueSchema} />);

    const input = screen.getByRole("combobox");

    await userEvent.type(input, "123");

    expect(screen.getByText("refineFurtherMessage")).toBeVisible();
  });

  it("should show notFoundMessage", async () => {
    vi.mocked(searchAddress).mockResolvedValueOnce({ options: [], error: false });
    render(<TestFormRenderer fields={testNoInitialValueSchema} />);

    const input = screen.getByRole("combobox");

    await userEvent.type(input, "123 test");

    await waitFor(() => expect(screen.getByText("notFoundMessage")).toBeVisible());
  });

  it("should show apiErrorMessage", async () => {
    vi.mocked(searchAddress).mockResolvedValueOnce({ options: [], error: true });
    render(<TestFormRenderer fields={testNoInitialValueSchema} />);

    const input = screen.getByRole("combobox");

    await userEvent.type(input, "123 test");

    await waitFor(() => expect(screen.getByText("apiErrorMessage")).toBeVisible());
  });

  it("should show list of options", async () => {
    const options = [
      { value: "Address Value 1", label: "Address Label 1" },
      { value: "Address Value 2", label: "Address Label 2" },
    ];
    vi.mocked(searchAddress).mockResolvedValueOnce({ options, error: false });
    render(<TestFormRenderer fields={testNoInitialValueSchema} />);

    const input = screen.getByRole("combobox");

    await userEvent.type(input, "Address");

    await waitFor(() => expect(screen.getByRole("listbox")).toBeVisible());

    expect(screen.getByRole("option", { name: "Address Label 1" })).toBeVisible();
    expect(screen.getByRole("option", { name: "Address Label 2" })).toBeVisible();
  });

  it("should should validate selected address", async () => {
    const options = [
      { value: "Address Value 1", label: "Address Label 1" },
      { value: "Address Value 2", label: "Address Label 2" },
    ];
    vi.mocked(searchAddress).mockResolvedValueOnce({ options, error: false });
    vi.mocked(validateSelectedAddress).mockResolvedValueOnce({
      dpid: "123",
      houseNumber: "1",
      streetName: "Test St",
      suburb: "Suburb",
      state: "WA",
      postcode: "6000",
      country: "AUSTRALIA",
    });
    render(<TestFormRenderer fields={testNoInitialValueSchema} />);

    const input = screen.getByRole("combobox");

    await userEvent.type(input, "Address");

    await waitFor(() => expect(screen.getByRole("listbox")).toBeVisible());

    await testHelper.clickText("Address Label 1", screen);

    expect(validateSelectedAddress).toHaveBeenCalledWith({ value: "Address Value 1", label: "Address Label 1" });

    expect(screen.queryByRole("listbox")).toBeNull();

    expect(input).toHaveValue("Address Label 1");
  });
});
