import { render, screen, waitFor } from "@testing-library/react";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { getOtpVerificationDetails } from "#graphql/mfa/getOtpVerificationDetails";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");
vi.mock("#graphql/mfa/getOtpVerificationDetails", () => ({
  getOtpVerificationDetails: vi.fn(),
}));

const testPage1Schema = [
  {
    name: "page1",
    component: "plain-text",
    label: "Page 1 Field",
  },
];

const testPage2Schema = [
  {
    name: "page2",
    component: "plain-text",
    label: "Page 2 Field",
  },
];

describe("Wizard", () => {
  it("should render with 1 page", () => {
    render(<TestFormRenderer fields={testPage1Schema} />);

    expect(screen.getByText("Page 1 Field")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
  });

  it("should render with 2 pages", () => {
    render(<TestFormRenderer fields={testPage1Schema} fieldsPage2={testPage2Schema} />);

    expect(screen.getByText("Page 1 Field")).toBeVisible();
    expect(screen.getByRole("button", { name: "Edit" })).toBeVisible();
  });

  it("should open MFA on edit click with no session", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: false,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    render(<TestFormRenderer fields={testPage1Schema} fieldsPage2={testPage2Schema} />);
    await testHelper.clickButton("Edit", screen);
    await waitFor(() => expect(screen.getByText("Let's verify it's you")).toBeVisible());
  });

  it("should open next page when has MFA session", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: true,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    render(<TestFormRenderer fields={testPage1Schema} fieldsPage2={testPage2Schema} />);
    await testHelper.clickButton("Edit", screen);
    await waitFor(() => expect(screen.getByText("Page 2 Field")).toBeVisible());
  });
});
