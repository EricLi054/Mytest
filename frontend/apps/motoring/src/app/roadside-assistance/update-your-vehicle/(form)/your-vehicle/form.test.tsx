import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EMPTY_URL } from "#constants";
import { mockYourVehicleContentfulData } from "#mocks/mockContentful";
import { expectGtmCustomEvent } from "#testing/analytics";
import { describe, expect, it, vi } from "vitest";

import type { YourVehicleFormProps } from "./form";
import YourVehicleForm from "./form";

// Imported server action in also imports server-only code
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

const vehicleUseField = mockYourVehicleContentfulData.fields.vehicleUse;
const isBrokenDownField = mockYourVehicleContentfulData.fields.isBrokenDown;

const privateUseRadio = () => screen.getByLabelText("Private use");
const businessUseRadio = () => screen.getByLabelText("Business use");
const brokenDownYesRadio = () => screen.getByLabelText("Yes");
const brokenDownNoRadio = () => screen.getByLabelText("No");

const renderForm = (defaultValues?: { defaultValues: YourVehicleFormProps["defaultValues"] }) => {
  const mockProps: YourVehicleFormProps = {
    ...defaultValues,
    yourVehicleAction: vi.fn(),
    myRacUrl: EMPTY_URL,
    contentfulData: mockYourVehicleContentfulData,
  };
  render(<YourVehicleForm {...mockProps} />);
};

describe("YourVehicleForm", () => {
  it("should be able to render with radio buttons and submit button", () => {
    renderForm();

    expect(screen.getByText(vehicleUseField.label)).toBeVisible();
    expect(privateUseRadio()).toBeVisible();
    expect(businessUseRadio()).toBeVisible();

    expect(screen.getByText(isBrokenDownField.label)).toBeVisible();
    expect(brokenDownYesRadio()).toBeVisible();
    expect(brokenDownNoRadio()).toBeVisible();

    expect(screen.getByRole("button", { name: /Next/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /Back/i })).toBeVisible();
  });

  it("should be able to render with session values", () => {
    renderForm({
      defaultValues: {
        vehicleUse: "Private use",
        isBrokenDown: "No",
      },
    });

    expect(screen.getByText(vehicleUseField.label)).toBeVisible();
    expect(privateUseRadio()).toBeVisible();
    expect(businessUseRadio()).toBeVisible();

    expect(screen.getByText(isBrokenDownField.label)).toBeVisible();
    expect(brokenDownYesRadio()).toBeVisible();
    expect(brokenDownNoRadio()).toBeVisible();

    expect(screen.getByRole("button", { name: /Next/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /Back/i })).toBeVisible();

    expect(privateUseRadio()).toHaveAttribute("aria-pressed", "true");
    expect(businessUseRadio()).toHaveAttribute("aria-pressed", "false");
    expect(brokenDownYesRadio()).toHaveAttribute("aria-pressed", "false");
    expect(brokenDownNoRadio()).toHaveAttribute("aria-pressed", "true");
  });

  it("should allow user to select radio buttons and submit the form", async () => {
    renderForm();

    await userEvent.click(privateUseRadio());

    expect(privateUseRadio()).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(businessUseRadio());

    expect(businessUseRadio()).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(brokenDownYesRadio());

    expect(brokenDownYesRadio()).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(brokenDownNoRadio());

    expect(brokenDownNoRadio()).toHaveAttribute("aria-pressed", "true");
  });

  it("should display a vehicle broken down notification card when user selects 'Yes' and raises a gtm event", async () => {
    renderForm();

    await userEvent.click(brokenDownYesRadio());

    const notificationCardTitle = screen.getByText(
      mockYourVehicleContentfulData.notifications.vehicleBrokenDownNotificationCard.title,
    );

    expect(notificationCardTitle).toBeVisible();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

    expectGtmCustomEvent("Sorry, you can't continue online - Broken down now");
  });

  it("should display a Business use notification card when user selects 'Business use' and raises a gtm event", async () => {
    renderForm();

    await userEvent.click(businessUseRadio());

    const notificationCardTitle = screen.getByText(
      mockYourVehicleContentfulData.notifications.businessUseNotificationCard.title,
    );

    expect(notificationCardTitle).toBeVisible();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

    expectGtmCustomEvent("Sorry, you can't continue online - Business use");
  });

  it("should display validation error message when both vehicle use and is broken down are not selected", async () => {
    renderForm();

    const nextButton = screen.getByRole("button", { name: /Next/i });
    await userEvent.click(nextButton);

    expect(screen.getByText(mockYourVehicleContentfulData.fields.isBrokenDown.requiredErrorMessage)).toBeVisible();
    expect(screen.getByText(mockYourVehicleContentfulData.fields.vehicleUse.requiredErrorMessage)).toBeVisible();
  });

  it("should display vehicle use validation error message only when broken down is selected but vehicle use is not selected", async () => {
    renderForm();

    await userEvent.click(brokenDownNoRadio());

    const nextButton = screen.getByRole("button", { name: /Next/i });
    await userEvent.click(nextButton);

    expect(screen.getByText(mockYourVehicleContentfulData.fields.vehicleUse.requiredErrorMessage)).toBeVisible();
    expect(
      screen.queryByText(mockYourVehicleContentfulData.fields.isBrokenDown.requiredErrorMessage),
    ).not.toBeInTheDocument();
  });

  it("should display vehicle use validation error message when broken down is selected but vehicle use is not selected", async () => {
    renderForm();

    await userEvent.click(privateUseRadio());

    const nextButton = screen.getByRole("button", { name: /Next/i });
    await userEvent.click(nextButton);

    expect(screen.getByText(mockYourVehicleContentfulData.fields.isBrokenDown.requiredErrorMessage)).toBeVisible();
    expect(
      screen.queryByText(mockYourVehicleContentfulData.fields.vehicleUse.requiredErrorMessage),
    ).not.toBeInTheDocument();
  });

  it.todo("should raise a gtm event when user selects a radio button x4");

  it.todo("should raise an event when the notification card is displayed x2");

  // TODO: Add test for form submission when this issue is resolved https://github.com/vercel/next.js/issues/54757
  it.todo("should handle form submission");
});
