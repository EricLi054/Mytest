import type { SafeParseReturnType, z } from "zod";
import { describe, expect, it } from "vitest";

import { matchSchema } from "./schema";
import { IdentificationMethod } from "./types";

describe("MatchSchema", () => {
  const validName = " Name -'() ";
  const validDateOfBirth = "01 / 1 / 2000";
  const validMobileNumber = "0400 123 456";

  describe("Valid", () => {
    const expectedName = "Name -'()";
    const expectedDateOfBirth = "2000-01-01";
    const expectedMobileNumber = "0400123456";
    const expectedMembershipNumber = "012345678";
    const expectedPolicyNumber = "MGP123456789";

    const expectValidationResult = (
      validationResult: SafeParseReturnType<z.infer<typeof matchSchema>, z.infer<typeof matchSchema>>,
      expected: z.infer<typeof matchSchema>,
    ) => {
      expect(validationResult.success).toBe(true);
      expect(validationResult.data?.firstName).toEqual(expectedName);
      expect(validationResult.data?.lastName).toEqual(expectedName);
      expect(validationResult.data?.dateOfBirth).toEqual(expectedDateOfBirth);
      expect(validationResult.data?.identificationMethod).toEqual(expected.identificationMethod);

      if (expected.identificationMethod === IdentificationMethod.Mobile) {
        expect(validationResult.data?.mobileNumber).toEqual(expectedMobileNumber);
      }
      if (expected.identificationMethod === IdentificationMethod.Membership) {
        expect(validationResult.data?.membershipNumber).toEqual(expectedMembershipNumber);
      }
      if (expected.identificationMethod === IdentificationMethod.Policy) {
        expect(validationResult.data?.policyNumber).toEqual(expectedPolicyNumber);
      }
    };

    describe("FirstName", () => {
      /* eslint-disable no-restricted-syntax */
      it.each([
        { firstName: "Name -'()", description: "standard hyphen U+002D" },
        { firstName: "Name ‒'()", description: "non-standard hyphen U+2012" },
        { firstName: "Name –'()", description: "non-standard hyphen U+2013" },
        { firstName: "Name —'()", description: "non-standard hyphen U+2014" },
        { firstName: "Name ―'()", description: "non-standard hyphen U+2015" },
        { firstName: "Name -'()", description: "standard single quote U+0027" },
        { firstName: "Name -‘()", description: "non-standard single quote U+2018" },
        { firstName: "Name -’()", description: "non-standard single quote U+2019" },
        { firstName: "Name -‛()", description: "non-standard single quote U+201B" },
        { firstName: "Name -′()", description: "non-standard single quote U+2032" },
        { firstName: " Name -'()", description: "leading whitespace" },
        { firstName: "Name -'() ", description: "trailing whitespace" },
      ])("should be valid when firstName contains $description: $firstName", ({ firstName }) => {
        const validData = {
          firstName: firstName,
          lastName: validName,
          dateOfBirth: validDateOfBirth,
          identificationMethod: IdentificationMethod.Mobile,
          mobileNumber: validMobileNumber,
        };

        const validationResult = matchSchema.safeParse(validData);
        expectValidationResult(validationResult, validData);
      });
    });

    describe("LastName", () => {
      it.each([
        { lastName: "Name -'()", description: "standard hyphen U+002D" },
        { lastName: "Name ‒'()", description: "non-standard hyphen U+2012" },
        { lastName: "Name –'()", description: "non-standard hyphen U+2013" },
        { lastName: "Name —'()", description: "non-standard hyphen U+2014" },
        { lastName: "Name ―'()", description: "non-standard hyphen U+2015" },
        { lastName: "Name -'()", description: "standard single quote U+0027" },
        { lastName: "Name -‘()", description: "non-standard single quote U+2018" },
        { lastName: "Name -’()", description: "non-standard single quote U+2019" },
        { lastName: "Name -‛()", description: "non-standard single quote U+201B" },
        { lastName: "Name -′()", description: "non-standard single quote U+2032" },
        { lastName: " Name -'()", description: "leading whitespace" },
        { lastName: "Name -'() ", description: "trailing whitespace" },
      ])("should be valid when lastName contains $description: $lastName", ({ lastName }) => {
        const validData = {
          firstName: validName,
          lastName: lastName,
          dateOfBirth: validDateOfBirth,
          identificationMethod: IdentificationMethod.Mobile,
          mobileNumber: validMobileNumber,
        };

        const validationResult = matchSchema.safeParse(validData);
        expectValidationResult(validationResult, validData);
      });
    });

    describe("DateOfBirth", () => {
      it.each([
        { dateOfBirth: "01 / 01 / 2000", description: "internal whitespace" },
        { dateOfBirth: " 01/01/2000", description: "leading whitespace" },
        { dateOfBirth: "01/01/2000 ", description: "trailing whitespace" },
      ])("should be valid when dateOfBirth contains $description: $dateOfBirth", ({ dateOfBirth }) => {
        const validData = {
          firstName: validName,
          lastName: validName,
          dateOfBirth: dateOfBirth,
          identificationMethod: IdentificationMethod.Mobile,
          mobileNumber: validMobileNumber,
        };

        const validationResult = matchSchema.safeParse(validData);

        expect(validationResult.success).toBe(true);
        expect(validationResult.data?.dateOfBirth).toEqual(expectedDateOfBirth);
      });

      it.each(["01/01/2000", "1/1/2000", "01/1/2000", "1/01/2000"])(
        "should be valid when dateOfBirth day or month is single digit: %s",
        (dateOfBirth) => {
          const validData = {
            firstName: validName,
            lastName: validName,
            dateOfBirth: dateOfBirth,
            identificationMethod: IdentificationMethod.Mobile,
            mobileNumber: validMobileNumber,
          };

          const validationResult = matchSchema.safeParse(validData);

          expect(validationResult.success).toBe(true);
          expect(validationResult.data?.dateOfBirth).toEqual(expectedDateOfBirth);
        },
      );

      it.each([
        ["29/02/2000", "2000-02-29"],
        ["29/02/2004", "2004-02-29"],
        ["29/02/2008", "2008-02-29"],
        ["29/02/2012", "2012-02-29"],
      ])("should be valid when dateOfBirth is february 29 in a leap year: %s", (dateOfBirth, expected) => {
        const validData = {
          firstName: validName,
          lastName: validName,
          dateOfBirth: dateOfBirth,
          identificationMethod: IdentificationMethod.Mobile,
          mobileNumber: validMobileNumber,
        };

        const validationResult = matchSchema.safeParse(validData);

        expect(validationResult.success).toBe(true);
        expect(validationResult.data?.dateOfBirth).toEqual(expected);
      });
    });

    describe("MobileNumber", () => {
      it.each([
        { mobileNumber: "0400 123 456", description: "internal whitespace" },
        { mobileNumber: " 0400123456", description: "leading whitespace" },
        { mobileNumber: "0400123456 ", description: "trailing whitespace" },
      ])(
        "should be valid when identificationMethod is 'mobile' and mobileNumber contains $description: $mobileNumber",
        ({ mobileNumber }) => {
          const validData = {
            firstName: validName,
            lastName: validName,
            dateOfBirth: validDateOfBirth,
            identificationMethod: IdentificationMethod.Mobile,
            mobileNumber: mobileNumber,
          };

          const validationResult = matchSchema.safeParse(validData);
          expectValidationResult(validationResult, validData);
        },
      );
    });

    describe("MembershipNumber", () => {
      it.each([
        { membershipNumber: "012345678", description: "numeric characters only" },
        { membershipNumber: "01-234567-8", description: "standard hyphen (U+002D)" },
        { membershipNumber: "01‒234567‒8", description: "non-standard hyphen (U+2012)" },
        { membershipNumber: "01–234567–8", description: "non-standard hyphen (U+2013)" },
        { membershipNumber: "01—234567—8", description: "non-standard hyphen (U+2014)" },
        { membershipNumber: "01―234567―8", description: "non-standard hyphen (U+2015)" },
        { membershipNumber: "01-234567—8", description: "mix of standard and non-standard hyphens" },
        { membershipNumber: "01 234567 8", description: "internal whitespace" },
        { membershipNumber: " 012345678", description: "leading whitespace" },
        { membershipNumber: "012345678 ", description: "trailing whitespace" },
      ])(
        "should be valid when identificationMethod is 'membership' and membershipNumber contains $description: $membershipNumber",
        ({ membershipNumber }) => {
          const validData = {
            firstName: validName,
            lastName: validName,
            dateOfBirth: validDateOfBirth,
            identificationMethod: IdentificationMethod.Membership,
            membershipNumber: membershipNumber,
          };

          const validationResult = matchSchema.safeParse(validData);
          expectValidationResult(validationResult, validData);
        },
      );
    });

    describe("PolicyNumber", () => {
      it.each([
        { policyNumber: "mgp123456789", description: "lowercase prefix" },
        { policyNumber: "MGP 123456789", description: "internal whitespace" },
        { policyNumber: " MGP123456789", description: "leading whitespace" },
        { policyNumber: "MGP123456789 ", description: "trailing whitespace" },
        { policyNumber: "MGP000123456789 ", description: "padded zeroes between prefix and identifier" },
      ])(
        "should be valid when identificationMethod is 'policy' and policyNumber contains $description: $policyNumber",
        ({ policyNumber }) => {
          const validData = {
            firstName: validName,
            lastName: validName,
            dateOfBirth: validDateOfBirth,
            identificationMethod: IdentificationMethod.Policy,
            policyNumber: policyNumber,
          };

          const validationResult = matchSchema.safeParse(validData);
          expectValidationResult(validationResult, validData);
        },
      );
    });
  });

  describe("Validation", () => {
    const requiredErrorMessage = "This field is required";

    describe("Required", () => {
      const expectValidationResult = (
        validationResult: SafeParseReturnType<z.infer<typeof matchSchema>, z.infer<typeof matchSchema>>,
      ) => {
        expect(validationResult.success).toBe(false);
        expect(validationResult.error?.errors.length).toBe(4);

        validationResult.error?.errors.forEach((error) => {
          expect(error.message).toBe(requiredErrorMessage);
        });
      };

      it.each([undefined, null])(
        "should return required field errors when identificationMethod is 'mobile' and mobileNumber is: %s",
        (invalidInput) => {
          const invalidData = {
            firstName: invalidInput,
            lastName: invalidInput,
            dateOfBirth: invalidInput,
            identificationMethod: IdentificationMethod.Mobile,
            mobileNumber: invalidInput,
          };

          const validationResult = matchSchema.safeParse(invalidData);
          expectValidationResult(validationResult);
        },
      );

      it.each([undefined, null])(
        "should return required field errors when identificationMethod is 'membership' and membershipNumber is: %s",
        (invalidInput) => {
          const invalidData = {
            firstName: invalidInput,
            lastName: invalidInput,
            dateOfBirth: invalidInput,
            identificationMethod: IdentificationMethod.Membership,
            membershipNumber: invalidInput,
          };

          const validationResult = matchSchema.safeParse(invalidData);
          expectValidationResult(validationResult);
        },
      );

      it.each([undefined, null])(
        "should return required field errors when identificationMethod is 'policy' and policyNumber is: %s",
        (invalidInput) => {
          const invalidData = {
            firstName: invalidInput,
            lastName: invalidInput,
            dateOfBirth: invalidInput,
            identificationMethod: IdentificationMethod.Policy,
            policyNumber: invalidInput,
          };

          const validationResult = matchSchema.safeParse(invalidData);
          expectValidationResult(validationResult);
        },
      );
    });

    describe("Invalid", () => {
      const invalidNameTestCases = ["", " ", "J0hn", "$teve", "|arry", "O`Donnell"];

      it.each(invalidNameTestCases)("should return validation error when firstName is: %s", (invalidFirstName) => {
        const invalidData = {
          firstName: invalidFirstName,
          lastName: validName,
          dateOfBirth: validDateOfBirth,
          identificationMethod: IdentificationMethod.Mobile,
          mobileNumber: validMobileNumber,
        };

        const validationResult = matchSchema.safeParse(invalidData);

        expect(validationResult.success).toBe(false);
        expect(validationResult.error?.errors.length).toBe(1);
        expect(validationResult.error?.errors[0]?.message).toBe("Please enter a valid first name");
      });

      it.each(invalidNameTestCases)("should return invalid field error when lastName is: %s", (invalidFirstName) => {
        const invalidData = {
          firstName: validName,
          lastName: invalidFirstName,
          dateOfBirth: validDateOfBirth,
          identificationMethod: IdentificationMethod.Mobile,
          mobileNumber: validMobileNumber,
        };

        const validationResult = matchSchema.safeParse(invalidData);

        expect(validationResult.success).toBe(false);
        expect(validationResult.error?.errors.length).toBe(1);
        expect(validationResult.error?.errors[0]?.message).toBe("Please enter a valid last name");
      });

      it.each(["12/30/2000", "01-01-2000", "2000/01/01", "29/02/2001", "29/02/1999"])(
        "should return invalid field error when dateOfBirth is: %s",
        (invalidDateOfBirth) => {
          const invalidData = {
            firstName: validName,
            lastName: validName,
            dateOfBirth: invalidDateOfBirth,
            identificationMethod: IdentificationMethod.Mobile,
            mobileNumber: validMobileNumber,
          };

          const validationResult = matchSchema.safeParse(invalidData);

          expect(validationResult.success).toBe(false);
          expect(validationResult.error?.errors.length).toBe(1);
          expect(validationResult.error?.errors[0]?.message).toBe("Please enter a valid date of birth (dd/mm/yyyy)");
        },
      );

      describe("MobileNumber", () => {
        const invalidErrorMessage = "Please enter a valid mobile number";

        it.each([
          { mobileNumber: "", description: "is empty string" },
          { mobileNumber: " ", description: "is whitespace string" },
        ])(
          "should return invalid and required field errors when mobileNumber $description: $mobileNumber",
          ({ mobileNumber }) => {
            const invalidData = {
              firstName: validName,
              lastName: validName,
              dateOfBirth: validDateOfBirth,
              identificationMethod: IdentificationMethod.Mobile,
              mobileNumber: mobileNumber,
            };

            const validationResult = matchSchema.safeParse(invalidData);

            expect(validationResult.success).toBe(false);
            expect(validationResult.error?.errors.length).toBe(2);
            expect(validationResult.error?.errors[0]?.message).toBe(invalidErrorMessage);
            expect(validationResult.error?.errors[1]?.message).toBe(requiredErrorMessage);
          },
        );

        it.each([
          { mobileNumber: "040000000", description: "is shorter than length requirement" },
          { mobileNumber: "04000000000", description: "is longer than length requirement" },
          { mobileNumber: "040000000o", description: "contains alphabetic character" },
          { mobileNumber: "0100000000", description: "does not start with 04" },
          { mobileNumber: "+614000000", description: "starts with invalid character +" },
        ])("should return invalid field error when mobileNumber $description: $mobileNumber", ({ mobileNumber }) => {
          const invalidData = {
            firstName: validName,
            lastName: validName,
            dateOfBirth: validDateOfBirth,
            identificationMethod: IdentificationMethod.Mobile,
            mobileNumber: mobileNumber,
          };

          const validationResult = matchSchema.safeParse(invalidData);

          expect(validationResult.success).toBe(false);
          expect(validationResult.error?.errors.length).toBe(1);
          expect(validationResult.error?.errors[0]?.message).toBe(invalidErrorMessage);
        });
      });

      describe("MembershipNumber", () => {
        const invalidErrorMessage = "Please enter a valid membership number";

        it.each([
          { membershipNumber: "", description: "is empty string" },
          { membershipNumber: " ", description: "is whitespace string" },
        ])(
          "should return invalid and required field errors when membershipNumber $description: $membershipNumber",
          ({ membershipNumber }) => {
            const invalidData = {
              firstName: validName,
              lastName: validName,
              dateOfBirth: validDateOfBirth,
              identificationMethod: IdentificationMethod.Membership,
              membershipNumber: membershipNumber,
            };

            const validationResult = matchSchema.safeParse(invalidData);

            expect(validationResult.success).toBe(false);
            expect(validationResult.error?.errors.length).toBe(2);
            expect(validationResult.error?.errors[0]?.message).toBe(invalidErrorMessage);
            expect(validationResult.error?.errors[1]?.message).toBe(requiredErrorMessage);
          },
        );

        it.each([
          { membershipNumber: "ol2345678", description: "contains alphabetic characters" },
          { membershipNumber: "01~234567~8", description: "contains invalid character ~" },
          { membershipNumber: "01_234567_8", description: "contains invalid character _" },
        ])(
          "should return invalid field error when membershipNumber $description: $membershipNumber",
          ({ membershipNumber }) => {
            const invalidData = {
              firstName: validName,
              lastName: validName,
              dateOfBirth: validDateOfBirth,
              identificationMethod: IdentificationMethod.Membership,
              membershipNumber: membershipNumber,
            };

            const validationResult = matchSchema.safeParse(invalidData);

            expect(validationResult.success).toBe(false);
            expect(validationResult.error?.errors.length).toBe(1);
            expect(validationResult.error?.errors[0]?.message).toBe(invalidErrorMessage);
          },
        );
      });

      describe("PolicyNumber", () => {
        const invalidErrorMessage = "Please enter a valid insurance policy number";

        it.each([
          { policyNumber: "", description: "is empty string" },
          { policyNumber: " ", description: "is whitespace string" },
        ])(
          "should return invalid and required field errors when policyNumber $description: $policyNumber",
          ({ policyNumber }) => {
            const invalidData = {
              firstName: validName,
              lastName: validName,
              dateOfBirth: validDateOfBirth,
              identificationMethod: IdentificationMethod.Policy,
              policyNumber: policyNumber,
            };

            const validationResult = matchSchema.safeParse(invalidData);

            expect(validationResult.success).toBe(false);
            expect(validationResult.error?.errors.length).toBe(2);
            expect(validationResult.error?.errors[0]?.message).toBe(invalidErrorMessage);
            expect(validationResult.error?.errors[1]?.message).toBe(requiredErrorMessage);
          },
        );

        // TODO - DED-855 - Discuss min length (3 chars length of prefix) and prefix validation (MGP/HGP/MGV/MGC/BGP/PET/MGE) with UX/PO/BA
        it.each([
          { policyNumber: "MGP%123456789", description: "contains invalid character %" },
          { policyNumber: "MGP@123456789", description: "contains invalid character @" },
          { policyNumber: "MGP-123456789", description: "contains invalid character -" },
          { policyNumber: "MGP_123456789", description: "contains invalid character _" },
        ])("should return invalid field error when policyNumber $description: $policyNumber", ({ policyNumber }) => {
          const invalidData = {
            firstName: validName,
            lastName: validName,
            dateOfBirth: validDateOfBirth,
            identificationMethod: IdentificationMethod.Policy,
            policyNumber: policyNumber,
          };

          const validationResult = matchSchema.safeParse(invalidData);

          expect(validationResult.success).toBe(false);
          expect(validationResult.error?.errors.length).toBe(1);
          expect(validationResult.error?.errors[0]?.message).toBe(invalidErrorMessage);
        });
      });
    });
  });
});
