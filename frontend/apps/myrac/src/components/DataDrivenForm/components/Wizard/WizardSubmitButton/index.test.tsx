import { render, screen, waitFor } from "@testing-library/react";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { getOtpVerificationDetails } from "#graphql/mfa/getOtpVerificationDetails";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import NameChangeConfirmationContent from "../../EngineeredForm/EditNameForm/NameChangeConfirmationContent";

vi.mock("server-only", () => ({}));

const refreshMock = vi.fn();
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      refresh: refreshMock,
      push: pushMock,
    };
  },
}));

const handlePrevMock = vi.fn();
vi.mock("../hooks", async () => {
  const actual = await vi.importActual("../hooks");

  return {
    ...actual,
    useWizardContext: () => {
      return {
        handlePrev: handlePrevMock,
      };
    },
  };
});

vi.mock("#graphql/mfa/getOtpVerificationDetails", () => ({
  getOtpVerificationDetails: vi.fn(),
}));

vi.mock("#graphql/mfa/sendOtp", () => ({
  sendOtp: vi.fn(),
}));

vi.mock("#graphql/mfa/verifyOtp", () => ({
  verifyOtp: vi.fn(),
}));

const testChangeableComponent = {
  name: "title",
  component: "button-select",
  label: "Title",
  required: true,
  validate: [
    {
      type: "required",
    },
  ],
  options: [
    {
      value: "Mr",
    },
    {
      value: "Mrs",
    },
    {
      value: "Miss",
    },
    {
      value: "Ms",
    },
    {
      value: "Mx",
    },
    {
      value: "Dr",
    },
  ],
};

const requiresConfirmationMock = vi.fn();
const requiresConfirmationTestSchema = [
  testChangeableComponent,
  {
    name: "submit",
    component: "wizard-submit-button",
    label: "Submit",
    validate: [],
    errorTitle: "Error message",
    successTitle: "Success message",
    errorButtonText: "Error",
    successButtonText: "Success",
    requiresConfirmation: requiresConfirmationMock,
    confirmationTitle: "Your first name is important",
    ConfirmationContent: NameChangeConfirmationContent,
    confirmationLogger: vi.fn(),
  },
];

const noConfirmationTestSchema = [
  testChangeableComponent,
  {
    name: "submit",
    component: "wizard-submit-button",
    label: "Submit",
    helperText: null,
    tooltipTitle: null,
    tooltipText: null,
    required: false,
    placeholder: null,
    validate: [],
    successText: {
      json: {
        nodeType: "document",
        data: {},
        content: [
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: "Successful rich text",
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
    errorText: {
      json: {
        data: {},
        content: [
          {
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: "Error rich text",
                nodeType: "text",
              },
            ],
            nodeType: "paragraph",
          },
        ],
        nodeType: "document",
      },
    },
    initialValue: null,
    initializeOnMount: true,
    errorTitle: "Error message",
    successTitle: "Success message",
    errorButtonText: "Error",
    successButtonText: "Success",
  },
];

describe("Wizard Submit Button", () => {
  it("should render button", () => {
    render(<TestFormRenderer fields={noConfirmationTestSchema} />);

    expect(screen.getByRole("button", { name: "Submit" })).toBeVisible();
  });

  it("should be disabled with no field change", () => {
    render(<TestFormRenderer fields={noConfirmationTestSchema} />);

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("should be be enabled with a field change", async () => {
    render(<TestFormRenderer fields={noConfirmationTestSchema} />);
    await testHelper.clickButton("Mrs", screen);

    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  it("should submit with no confirmation requirements and open success modal", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: true,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    render(<TestFormRenderer fields={noConfirmationTestSchema} />);
    await testHelper.clickButton("Mrs", screen);

    await testHelper.clickButton("Submit", screen);

    await waitFor(() => expect(screen.getByText("Success message")).toBeVisible());
  });

  it("should submit with no confirmation requirements and open error modal", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: true,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    render(<TestFormRenderer fields={noConfirmationTestSchema} submitResponse={false} />);
    await testHelper.clickButton("Mrs", screen);

    await testHelper.clickButton("Submit", screen);

    await waitFor(() => expect(screen.getByText("Error message")).toBeVisible());
  });

  it("should submit with confirmation requirements and open the confirmation modal", async () => {
    requiresConfirmationMock.mockReturnValueOnce(true);
    render(<TestFormRenderer fields={requiresConfirmationTestSchema} />);
    await testHelper.clickButton("Mrs", screen);

    await testHelper.clickButton("Submit", screen);

    await waitFor(() => expect(screen.getByText("Your first name is important")).toBeVisible());
  });

  it("should submit with confirmation requirements and submit when not needed", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: true,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    requiresConfirmationMock.mockReturnValueOnce(false);
    render(<TestFormRenderer fields={requiresConfirmationTestSchema} />);
    await testHelper.clickButton("Mrs", screen);

    await testHelper.clickButton("Submit", screen);

    await waitFor(() => expect(screen.getByText("Success message")).toBeVisible());
  });

  it("should go back to previous step on confirm click", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: true,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    render(<TestFormRenderer fields={noConfirmationTestSchema} />);
    await testHelper.clickButton("Mrs", screen);

    await testHelper.clickButton("Submit", screen);

    await waitFor(() => expect(screen.getByText("Success message")).toBeVisible());

    await testHelper.clickButton("Success", screen);

    expect(handlePrevMock).toHaveBeenCalledTimes(1);
  });

  it("should show MFA modal if session has expired", async () => {
    vi.mocked(getOtpVerificationDetails).mockResolvedValueOnce({
      isAuthenticated: false,
      isMobile: true,
      phoneNumberSuffix: "123",
    });
    render(<TestFormRenderer fields={noConfirmationTestSchema} submitResponse={true} />);
    await testHelper.clickButton("Mrs", screen);

    await testHelper.clickButton("Submit", screen);

    await waitFor(() => expect(screen.getByText("Let's verify it's you")).toBeVisible());
  });
});
