import { useActionState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFormAction } from "#testing";
import { expectGtmCustomEvent, expectGtmFieldTouched } from "#testing/analytics";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMfaModalDialog } from "@racwa/mfa";

import type { IdentificationMethodValue, Person, PersonMatchError } from "./types";
import MatchForm from "./Form";
import { MfaModalDialogProvider } from "./providers/mfa";
import { IdentificationMethod } from "./types";

vi.mock("server-only", () => ({}));
vi.mock("next-auth/react");
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

const routerPushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: routerPushMock,
    };
  },
}));

const openMfaModalMock = vi.fn();
vi.mock("@racwa/mfa", async () => {
  const actual = await vi.importActual("@racwa/mfa");
  return {
    ...actual,
    useMfaModalDialog: vi.fn(),
  };
});

const getPersonMock = vi.fn();

const validFirstName = "John";
const validLastName = "Smith";
const validDateOfBirth = "31/01/2000";
const validPolicyNumber = "MGP123456789";
const dateOfBirthPlaceholder = "DD/MM/YYYY";
const requiredErrorMessage = "This field is required";
const validMobileNumber = "0412345678";
const validMembershipNumber = "01-248815-4";

const mockMatchedPerson: Person = {
  personId: "00000000-0000-0000-0000-00000000000",
  racId: "00000001",
  firstName: "John",
  mobilePhone: "0400000000",
  membershipType: "Member",
};

const renderForm = () =>
  render(
    <MfaModalDialogProvider getVerificationDetailsAction={vi.fn()} sendOtpAction={vi.fn()} verifyOtpAction={vi.fn()}>
      <MatchForm reCaptchaSiteKey="token" formAction={mockFormAction} />
    </MfaModalDialogProvider>,
  );

const getSubmitButton = () => screen.getByRole("button", { name: "Next" });
const getFirstNameInput = () => screen.getByPlaceholderText("e.g. John");
const getLastNameInput = () => screen.getByPlaceholderText("e.g. Smith");
const getDateOfBirthInput = () => screen.getByPlaceholderText(dateOfBirthPlaceholder);
const getMobileNumberInput = () => screen.getByPlaceholderText("e.g. 0412345678");
const getMembershipNumberInput = () => screen.getByPlaceholderText("e.g. 01-248815-4");
const getPolicyNumberInput = () => screen.getByPlaceholderText("e.g. MGP123456789");
const getIdentificationMethodRadioItem = (identificationMethod: IdentificationMethodValue) => {
  switch (identificationMethod) {
    case IdentificationMethod.Mobile:
      return screen.getByRole("radio", { name: "Mobile number identification method option" });
    case IdentificationMethod.Membership:
      return screen.getByRole("radio", { name: "Membership number identification method option" });
    case IdentificationMethod.Policy:
      return screen.getByRole("radio", { name: "Insurance policy number identification method option" });
  }
};

describe("MatchForm", () => {
  beforeEach(() => {
    vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
    getPersonMock.mockResolvedValue(mockMatchedPerson);
    vi.mocked(useMfaModalDialog).mockReturnValue({
      openMfaModal: openMfaModalMock,
      closeMfaModal: vi.fn(),
      mfaOnErrorTriggered: false,
      mfaOnSuccessTriggered: false,
    });
  });

  describe("Render", () => {
    it("should render with mobile number identification method defaulted", () => {
      renderForm();

      expect(screen.getByText("To start, let's confirm your details")).toBeVisible();
      expect(screen.getByText("First name")).toBeVisible();
      expect(screen.getByText("Last name")).toBeVisible();
      expect(screen.getByText("Date of birth")).toBeVisible();
      expect(screen.getByText("Select an option to verify your identity")).toBeVisible();

      const mobileNumberElements = screen.getAllByText("Mobile number", { exact: true });

      expect(mobileNumberElements).toHaveLength(2);
      expect(mobileNumberElements[0]).toBeVisible();
      expect(mobileNumberElements[1]).toBeVisible();
      expect(
        screen.queryByRole("spinbutton", { name: "Mobile number The mobile number you provided to RAC" }),
        "Mobile number input should not have increase/decrease spinbutton adornment",
      ).not.toBeInTheDocument();

      const membershipNumberElements = screen.getAllByText("Membership number", { exact: true });

      expect(membershipNumberElements).toHaveLength(1);
      expect(membershipNumberElements[0]).toBeVisible();

      const policyNumberElements = screen.getAllByText("Insurance policy number", { exact: true });

      expect(policyNumberElements).toHaveLength(1);
      expect(policyNumberElements[0]).toBeVisible();
    });

    it("should render inputs with autocomplete attributes", async () => {
      const user = userEvent.setup();
      renderForm();

      expect(getFirstNameInput()).toHaveAttribute("autocomplete", "given-name");
      expect(getLastNameInput()).toHaveAttribute("autocomplete", "family-name");
      expect(getDateOfBirthInput()).toHaveAttribute("autocomplete", "off");
      expect(getMobileNumberInput()).toHaveAttribute("autocomplete", "mobile tel-national");

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));

      expect(getMembershipNumberInput()).toHaveAttribute("autocomplete", "off");

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));

      expect(getPolicyNumberInput()).toHaveAttribute("autocomplete", "off");
    });

    it("should render inputs with spellCheck disabled", async () => {
      const user = userEvent.setup();
      renderForm();

      expect(getFirstNameInput()).toHaveAttribute("spellCheck", "false");
      expect(getLastNameInput()).toHaveAttribute("spellCheck", "false");
      expect(getDateOfBirthInput()).toHaveAttribute("spellCheck", "false");
      expect(getMobileNumberInput()).toHaveAttribute("spellCheck", "false");

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));

      expect(getMembershipNumberInput()).toHaveAttribute("spellCheck", "false");

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));

      expect(getPolicyNumberInput()).toHaveAttribute("spellCheck", "false");
    });

    describe("DateOfBirth", () => {
      it("should render DateOfBirth input clear icon", async () => {
        const clearButtonName = "Clear";
        const user = userEvent.setup();
        renderForm();

        expect(screen.queryByRole("button", { name: clearButtonName })).toBeNull();

        await user.type(getDateOfBirthInput(), validDateOfBirth);
        const clearButton = screen.getByRole("button", { name: clearButtonName });

        expect(clearButton).toBeVisible();

        await user.tab();

        expect(clearButton).toBeVisible();

        await user.click(clearButton);

        expect(screen.queryByRole("button", { name: clearButtonName })).toBeNull();
        expect(getDateOfBirthInput()).toHaveValue(dateOfBirthPlaceholder);
      });

      it("should render DateOfBirth input with type of 'text'", () => {
        renderForm();

        expect(getDateOfBirthInput()).toHaveAttribute("type", "text");
      });

      it("should render DateOfBirth input with inputMode of 'numeric' on focus", async () => {
        const user = userEvent.setup();
        renderForm();

        const dateOfBirthInput = getDateOfBirthInput();
        await user.click(dateOfBirthInput);

        expect(dateOfBirthInput).toHaveAttribute("inputMode", "numeric");
      });
    });
  });

  describe("Submit", () => {
    /** TODO - DED-1296 - Update to expect navigation/redirect on successful submit once implemented */
    const expectFormSubmittedSuccessfully = () => {
      expect(screen.queryByText(requiredErrorMessage)).not.toBeInTheDocument();
      expect(screen.queryByText("Please enter", { exact: false })).not.toBeInTheDocument();
    };

    it("should render with disabled submit button when isPending is true", () => {
      vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), true]);
      renderForm();

      expect(getSubmitButton()).toBeDisabled();
    });

    it("should render with disabled submit button when mfaOnSuccessTriggered is true", () => {
      vi.mocked(useMfaModalDialog).mockReturnValue({
        openMfaModal: openMfaModalMock,
        closeMfaModal: vi.fn(),
        mfaOnErrorTriggered: false,
        mfaOnSuccessTriggered: true,
      });
      renderForm();

      expect(getSubmitButton()).toBeDisabled();
    });

    it("should render with disabled submit button when mfaOnErrorTriggered is true", () => {
      vi.mocked(useMfaModalDialog).mockReturnValue({
        openMfaModal: openMfaModalMock,
        closeMfaModal: vi.fn(),
        mfaOnErrorTriggered: true,
        mfaOnSuccessTriggered: false,
      });
      renderForm();

      expect(getSubmitButton()).toBeDisabled();
    });

    it("should submit successfully when default identification method (mobileNumber) is selected", async () => {
      const user = userEvent.setup();
      vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
      renderForm();

      await user.type(getFirstNameInput(), validFirstName);
      await user.type(getLastNameInput(), validLastName);
      await user.type(getDateOfBirthInput(), validDateOfBirth);
      await user.type(getMobileNumberInput(), "0412 345 678");
      await user.click(getSubmitButton());

      expectFormSubmittedSuccessfully();
    });

    it("should submit successfully when membershipNumber identification method is selected", async () => {
      const user = userEvent.setup();
      vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
      renderForm();

      await user.type(getFirstNameInput(), validFirstName);
      await user.type(getLastNameInput(), validLastName);
      await user.type(getDateOfBirthInput(), validDateOfBirth);
      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));
      await user.type(getMembershipNumberInput(), validMembershipNumber);
      await user.click(getSubmitButton());

      expectFormSubmittedSuccessfully();
    });

    it("should submit successfully when policyNumber identification method is selected", async () => {
      const user = userEvent.setup();
      vi.mocked(useActionState).mockReturnValue([{}, vi.fn(), false]);
      renderForm();

      await user.type(getFirstNameInput(), validFirstName);
      await user.type(getLastNameInput(), validLastName);
      await user.type(getDateOfBirthInput(), validDateOfBirth);
      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));
      await user.type(getPolicyNumberInput(), validPolicyNumber);
      await user.click(getSubmitButton());

      expectFormSubmittedSuccessfully();
    });

    it("should show error card when no match found", async () => {
      const user = userEvent.setup();
      vi.mocked(useActionState).mockReturnValue([
        { status: "error", error: { "": ["NoMatchError" satisfies PersonMatchError] } },
        vi.fn(),
        false,
      ]);
      renderForm();

      await user.type(getFirstNameInput(), validFirstName);
      await user.type(getLastNameInput(), validLastName);
      await user.type(getDateOfBirthInput(), validDateOfBirth);
      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));
      await user.type(getPolicyNumberInput(), validPolicyNumber);
      await user.click(getSubmitButton());

      expect(screen.getByText("We couldn't find your details")).toBeVisible();
    });

    it.each([
      { identificationMethod: IdentificationMethod.Mobile, expectedValue: validMobileNumber },
      { identificationMethod: IdentificationMethod.Policy, expectedValue: validPolicyNumber },
      { identificationMethod: IdentificationMethod.Membership, expectedValue: validMembershipNumber },
    ])(
      "should preserve set input to initial value on failed submit for identification method: $identificationMethod",
      async ({ identificationMethod, expectedValue }) => {
        const user = userEvent.setup();
        const lastResult = {
          initialValue: {
            identificationMethod: IdentificationMethod.Mobile,
            firstName: validFirstName,
            lastName: validLastName,
            dateOfBirth: validDateOfBirth,
            mobileNumber: identificationMethod === IdentificationMethod.Mobile ? expectedValue : "",
            membershipNumber: identificationMethod === IdentificationMethod.Membership ? expectedValue : "",
            policyNumber: identificationMethod === IdentificationMethod.Policy ? expectedValue : "",
          },
          status: "error",
          error: { "": ["NoMatchError" satisfies PersonMatchError] },
        };
        vi.mocked(useActionState).mockReturnValue([lastResult, vi.fn(), false]);
        renderForm();

        const firstNameInput = getFirstNameInput() as HTMLInputElement;
        const lastNameInput = getLastNameInput() as HTMLInputElement;
        const dateOfBirthInput = getDateOfBirthInput() as HTMLInputElement;
        await user.click(getIdentificationMethodRadioItem(identificationMethod));

        await user.click(getSubmitButton());

        expect(firstNameInput.value).toBe(validFirstName);
        expect(lastNameInput.value).toBe(validLastName);
        expect(dateOfBirthInput.value).toBe(validDateOfBirth);

        switch (identificationMethod) {
          case IdentificationMethod.Mobile: {
            expect(getMobileNumberInput()).toHaveValue(expectedValue);

            break;
          }
          case IdentificationMethod.Membership: {
            expect(getMembershipNumberInput()).toHaveValue(expectedValue);

            break;
          }
          case IdentificationMethod.Policy: {
            expect(getPolicyNumberInput()).toHaveValue(expectedValue);

            break;
          }
        }
      },
    );

    it("should show error card when duplicate match found", async () => {
      const user = userEvent.setup();
      vi.mocked(useActionState).mockReturnValue([
        { status: "error", error: { "": ["DuplicateMatchError" satisfies PersonMatchError] } },
        vi.fn(),
        false,
      ]);
      renderForm();

      await user.type(getFirstNameInput(), validFirstName);
      await user.type(getLastNameInput(), validLastName);
      await user.type(getDateOfBirthInput(), validDateOfBirth);
      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));
      await user.type(getPolicyNumberInput(), validPolicyNumber);
      await user.click(getSubmitButton());

      expect(screen.getByText("There was an issue with your details")).toBeVisible();
    });

    describe("OnSuccess", () => {
      // TODO - Need to figure out how to mock the onSuccess callback to test this
      it.skip("should open ShowAdb2cLoadingModal on submission success", async () => {
        vi.mocked(useActionState).mockReturnValue([{ status: "success" }, vi.fn(), false]);
        renderForm();

        await waitFor(() => expect(screen.getByText("We've verified you!")).toBeVisible());
      });

      it("should call openMfaModal on submission success with signInWithAdb2c function and 'We've found you!' default loading message", () => {
        vi.mocked(useActionState).mockReturnValue([{ status: "success" }, vi.fn(), false]);
        renderForm();

        expect(openMfaModalMock).toHaveBeenCalledWith(
          expect.objectContaining({ name: "signInWithAdb2c" }),
          "We've found you!",
        );
      });

      it.each([undefined, null, "", " ", "MAX_NAME_LENGTH+"])(
        "should call openMfaModal on submission success with signInWithAdb2c function and 'We've found you!' default loading message when member first name is [%s]",
        (firstName) => {
          vi.mocked(useActionState).mockReturnValue([
            { status: "success", initialValue: { firstName: firstName } },
            vi.fn(),
            false,
          ]);
          renderForm();

          expect(openMfaModalMock).toHaveBeenCalledWith(
            expect.objectContaining({ name: "signInWithAdb2c" }),
            "We've found you!",
          );
        },
      );

      it.each(["A", "John", "John-John", "Johnny John Boy", "MAX_NAME_LENGTH"])(
        "should call openMfaModal on submission success with signInWithAdb2c function and 'We've found you, %s!' custom loading message",
        (firstName) => {
          vi.mocked(useActionState).mockReturnValue([
            { status: "success", initialValue: { firstName: firstName } },
            vi.fn(),
            false,
          ]);
          renderForm();

          expect(openMfaModalMock).toHaveBeenCalledWith(
            expect.objectContaining({ name: "signInWithAdb2c" }),
            `We've found you, ${firstName}!`,
          );
        },
      );

      it.each([" MAX_NAME_LENGTH", "MAX_NAME_LENGTH ", " MAX_NAME_LENGTH "])(
        "should call openMfaModal on submission success with signInWithAdb2c function and 'We've found you, MAX_NAME_LENGTH!' custom loading message when member first name [%s] is less than or equal to 15 chars after trimming leading and trailing whitespace",
        (firstName) => {
          vi.mocked(useActionState).mockReturnValue([
            { status: "success", initialValue: { firstName: firstName } },
            vi.fn(),
            false,
          ]);
          renderForm();

          expect(openMfaModalMock).toHaveBeenCalledWith(
            expect.objectContaining({ name: "signInWithAdb2c" }),
            "We've found you, MAX_NAME_LENGTH!",
          );
        },
      );
    });
  });

  describe("InputRestriction", () => {
    describe("InvalidCharacters", () => {
      describe("MobileNumber", () => {
        const invalidInput = " 0s4$1-2'3d4]5/6+7*8 ";
        const expected = "0412345678";

        it("should remove non-numeric characters in the 'Mobile number' field when typing input", async () => {
          const user = userEvent.setup();
          renderForm();

          const mobileNumberInput = getMobileNumberInput();
          await user.type(mobileNumberInput, invalidInput);

          expect(mobileNumberInput).toHaveValue(expected);
        });

        it("should remove non-numeric characters in the 'Mobile number' field when pasting input", async () => {
          const user = userEvent.setup();
          renderForm();

          const mobileNumberInput = getMobileNumberInput();
          await user.click(mobileNumberInput);
          await user.paste(invalidInput);

          expect(mobileNumberInput).toHaveValue(expected);
        });
      });
    });

    describe("Length", () => {
      describe("FirstName", () => {
        const maxLength = 50; // MAX_FIRST_NAME_LENGTH
        const invalidInput = "a".repeat(maxLength + 1);

        it("should enforce a max length on the 'First name' field when typing input", async () => {
          const user = userEvent.setup();
          renderForm();

          const firstName = getFirstNameInput();
          await user.type(firstName, invalidInput);

          expect(firstName).toHaveValue(invalidInput.substring(0, maxLength));
        });

        it("should enforce a max length on the 'First name' field when pasting input", async () => {
          const user = userEvent.setup();
          renderForm();

          const firstName = getFirstNameInput();
          await user.click(firstName);
          await user.paste(invalidInput);

          expect(firstName).toHaveValue(invalidInput.substring(0, maxLength));
        });
      });

      describe("LastName", () => {
        const maxLength = 55; // MAX_LAST_NAME_LENGTH
        const invalidInput = "a".repeat(maxLength + 1);

        it("should enforce a max length on the 'Last name' field when typing input", async () => {
          const user = userEvent.setup();
          renderForm();

          const lastName = getLastNameInput();
          await user.type(lastName, invalidInput);

          expect(lastName).toHaveValue(invalidInput.substring(0, maxLength));
        });

        it("should enforce a max length on the 'Last name' field when pasting input", async () => {
          const user = userEvent.setup();
          renderForm();

          const lastName = getLastNameInput();
          await user.click(lastName);
          await user.paste(invalidInput);

          expect(lastName).toHaveValue(invalidInput.substring(0, maxLength));
        });
      });

      describe("MembershipNumber", () => {
        const maxLength = 50; // MAX_MEMBERSHIP_NUMBER_LENGTH
        const invalidInput = "a".repeat(maxLength + 1);

        it("should enforce a max length on the 'Membership number' field when typing input", async () => {
          const user = userEvent.setup();
          renderForm();

          await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));
          const membershipNumber = getMembershipNumberInput();
          await user.type(membershipNumber, invalidInput);

          expect(membershipNumber).toHaveValue(invalidInput.substring(0, maxLength));
        });

        it("should enforce a max length on the 'Membership number' field when pasting input", async () => {
          const user = userEvent.setup();
          renderForm();

          await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));
          const membershipNumber = getMembershipNumberInput();
          await user.click(membershipNumber);
          await user.paste(invalidInput);

          expect(membershipNumber).toHaveValue(invalidInput.substring(0, maxLength));
        });
      });

      describe("InsurancePolicyNumber", () => {
        const maxLength = 15; // MAX_INSURANCE_POLICY_NUMBER_LENGTH
        const invalidInput = "a".repeat(maxLength + 1);

        it("should enforce a max length on the 'Insurance policy number' field when typing input", async () => {
          const user = userEvent.setup();
          renderForm();

          await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));
          const policyNumber = getPolicyNumberInput();
          await user.type(policyNumber, invalidInput);

          expect(policyNumber).toHaveValue(invalidInput.substring(0, maxLength));
        });

        it("should enforce a max length on the 'Insurance policy number' field when pasting input", async () => {
          const user = userEvent.setup();
          renderForm();

          await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));
          const policyNumber = getPolicyNumberInput();
          await user.click(policyNumber);
          await user.paste(invalidInput);

          expect(policyNumber).toHaveValue(invalidInput.substring(0, maxLength));
        });
      });
    });

    describe("FormValidation", () => {
      /**
       * Match form currently has 4 required fields:
       * - First name
       * - Last name
       * - Date of birth
       * - Input for selected identification method radio group option
       */
      const expectRequiredFieldErrors = () => {
        const errorMessages = screen.getAllByText(requiredErrorMessage);

        expect(errorMessages.length).toBe(4);
      };

      describe("Required", () => {
        it("should trigger required field error validation when default identification method (mobileNumber) is selected", async () => {
          const user = userEvent.setup();
          renderForm();

          await user.click(getSubmitButton());

          expectRequiredFieldErrors();
        });

        it("should trigger required field error validation when membershipNumber identification method is selected", async () => {
          const user = userEvent.setup();
          renderForm();

          await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));
          await user.click(getSubmitButton());

          expectRequiredFieldErrors();
        });

        it("should trigger required field error validation when policyNumber identification method is selected", async () => {
          const user = userEvent.setup();
          renderForm();

          await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));
          await user.click(getSubmitButton());

          expectRequiredFieldErrors();
        });
      });
    });
  });

  describe("LoadingModals", () => {
    it("should render with 'Submitting' loading modal when isPending is true", () => {
      vi.mocked(useActionState).mockReturnValueOnce([{}, vi.fn(), true]);
      renderForm();

      expect(screen.getByText("Submitting")).toBeVisible();
    });

    it("should display 'Weve verified you!' loading modal when mfaOnSuccessTriggered is true", () => {
      vi.mocked(useMfaModalDialog).mockReturnValue({
        openMfaModal: openMfaModalMock,
        closeMfaModal: vi.fn(),
        mfaOnErrorTriggered: false,
        mfaOnSuccessTriggered: true,
      });
      renderForm();

      expect(screen.getByText("We've verified you!")).toBeVisible();
    });

    it("should display 'Something went wrong' loading modal when mfaOnErrorTriggered is true", () => {
      vi.mocked(useMfaModalDialog).mockReturnValue({
        openMfaModal: openMfaModalMock,
        closeMfaModal: vi.fn(),
        mfaOnErrorTriggered: true,
        mfaOnSuccessTriggered: false,
      });
      renderForm();

      expect(screen.getByText("Something went wrong")).toBeVisible();
    });
  });

  describe("Analytics", () => {
    it("should send field touched gtm message for the 'First name' field on blur", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getFirstNameInput());
      await user.tab();

      expectGtmFieldTouched("First name");
    });

    it("should send field touched gtm message for the 'Last name' field on blur", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getLastNameInput());
      await user.tab();

      expectGtmFieldTouched("Last name");
    });

    it("should send field touched gtm message for the 'Date of birth' field on blur", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getDateOfBirthInput());
      await user.tab();

      expectGtmFieldTouched("Date of birth");
    });

    it("should send custom event and field touched gtm messages for the 'Mobile number' radio item on click", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Mobile));

      // Field touched gtm message is not triggered if the field is already selected
      expectGtmCustomEvent("Mobile number");
    });

    it("should send custom event and field touched gtm messages for the 'Membership number' radio item on click", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));

      expectGtmFieldTouched("Select an option to verify your identity");
      expectGtmCustomEvent("Membership number");
    });

    it("should send custom event and field touched gtm messages for the 'Insurance policy number' radio item on click", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));

      expectGtmFieldTouched("Select an option to verify your identity");
      expectGtmCustomEvent("Insurance policy number");
    });

    it("should send field touched gtm message for the 'Mobile number' field on blur", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getMobileNumberInput());
      await user.tab();

      expectGtmFieldTouched("Mobile number");
    });

    it("should send field touched gtm message for the 'Membership number' field on blur", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));
      await user.click(getMembershipNumberInput());
      await user.tab();

      expectGtmFieldTouched("Membership number");
    });

    it("should send field touched gtm message for the 'Insurance policy number' field on blur", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));
      await user.click(getPolicyNumberInput());
      await user.tab();

      expectGtmFieldTouched("Insurance policy number");
    });

    it("should send custom event gtm message for the Cancel link on click", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByText("Cancel"));

      expectGtmCustomEvent("Cancel");
    });

    it("should send custom event gtm message when member matched", async () => {
      vi.mocked(useActionState).mockReturnValue([{ status: "success" }, vi.fn(), false]);
      const user = userEvent.setup();
      renderForm();

      await user.type(getFirstNameInput(), validFirstName);
      await user.type(getLastNameInput(), validLastName);
      await user.type(getDateOfBirthInput(), validDateOfBirth);
      await user.type(getMobileNumberInput(), "0412 345 678");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("Member matched");
    });

    it("should send custom event gtm message when member not matched", async () => {
      vi.mocked(useActionState).mockReturnValue([
        { status: "error", error: { "": ["NoMatchError" satisfies PersonMatchError] } },
        vi.fn(),
        false,
      ]);
      const user = userEvent.setup();
      renderForm();

      await user.type(getFirstNameInput(), validFirstName);
      await user.type(getLastNameInput(), validLastName);
      await user.type(getDateOfBirthInput(), validDateOfBirth);
      await user.type(getMobileNumberInput(), "0412 345 678");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("We couldn't find your details error dialog");
    });

    it("should send custom event gtm message when duplicates found", async () => {
      vi.mocked(useActionState).mockReturnValue([
        { status: "error", error: { "": ["DuplicateMatchError" satisfies PersonMatchError] } },
        vi.fn(),
        false,
      ]);
      const user = userEvent.setup();
      renderForm();

      await user.type(getFirstNameInput(), validFirstName);
      await user.type(getLastNameInput(), validLastName);
      await user.type(getDateOfBirthInput(), validDateOfBirth);
      await user.type(getMobileNumberInput(), "0412 345 678");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("There was an issue with your details duplicate error dialog");
    });

    it("should send custom event gtm message when nothing entered", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getSubmitButton());

      expectGtmCustomEvent("Nothing entered error validation");
    });

    it("should send custom event gtm message for first name character validation error", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(getFirstNameInput(), "999");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("First name character error validation");
    });

    it("should send custom event gtm message for last name character validation error", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(getLastNameInput(), "999");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("Last name character error validation");
    });

    it("should send custom event gtm message for date of birth character validation error", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(getDateOfBirthInput(), "99");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("Date of birth error validation");
    });

    it("should send custom event gtm message for mobile character validation error", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(getMobileNumberInput(), "999");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("Mobile number character error validation");
    });

    it("should send custom event gtm message for membership number validation error", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Membership));
      await user.type(getMembershipNumberInput(), "a");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("Membership number character error validation");
    });

    it("should send custom event gtm message for policy number validation error", async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(getIdentificationMethodRadioItem(IdentificationMethod.Policy));
      await user.type(getPolicyNumberInput(), "$");
      await user.click(getSubmitButton());

      expectGtmCustomEvent("Insurance policy number character error validation");
    });
  });
});
