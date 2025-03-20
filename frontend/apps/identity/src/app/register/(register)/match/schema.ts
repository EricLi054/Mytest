import {
  FORMATTED_DATE_STRING_REGEX,
  INVALID_DATE_OF_BIRTH_ERROR_MESSAGE,
  NON_NUMERIC_REGEX,
  REQUIRED_ERROR_MESSAGE,
  WHITESPACE_REGEX,
} from "#utils/constants";
import { z } from "zod";

import { IdentificationMethod } from "./types";

/**
 * Match all non-standard hyphen characters.
 *
 * Align with Insurance Contact Service (ICS):
 * - https://github.com/racwa/raci-contact-service/blob/main/src/Raci.ContactService.Common/Extensions/StringExtensions.cs
 */
const NON_STANDARD_HYPHEN_REGEX = new RegExp(/[\u2012\u2013\u2014\u2015]/g);

/**
 * Match all non-standard single quote characters.
 *
 * Align with Insurance Contact Service (ICS):
 * - https://github.com/racwa/raci-contact-service/blob/main/src/Raci.ContactService.Common/Extensions/StringExtensions.cs
 */
const NON_STANDARD_SINGLE_QUOTE_REGEX = new RegExp(/[\u2018\u2019\u201b\u2032]/g);

/**
 * Regex to validate member name inputs.
 *
 * Non-standard characters are replaced by standard character equivalents before validation.
 *
 * The following page has varying validation rules for member first/last name,
 * so going with least restrictive rules for now:
 * - https://rac-wa.atlassian.net/wiki/spaces/DE/pages/3019505722/Name+fields
 *
 * Inputs set max length but length limit is not currently enforced in the schema.
 */
const MEMBER_NAME_REGEX = new RegExp(/^[A-Z-'() ]+$/i);

/**
 * Regex to validate membership number input.
 *
 * The following page has varying validation rules for membership number:
 * - https://rac-wa.atlassian.net/wiki/spaces/DE/pages/3019505769/Membership+details
 *
 * Acceptance criteria for DED-855 requires a valid membership number be up to 50 numeric characters,
 * even though the above page specifies a max length of 50 or 9 characters depending on the system:
 * - https://rac-wa.atlassian.net/browse/DED-855
 *
 * Input sets max length to 50 as the least restrictive length limit,
 * but length limit is not currently enforced in the schema.
 */
const MEMBERSHIP_NUMBER_REGEX = new RegExp(/^[0-9]+$/i);

/**
 * Sanitize member name:
 * - Trim leading/trailing whitespace
 * - Replace non-standard hyphens with the equivalent standard hyphens
 * - Replace non-standard single quotes with the equivalent standard single quote
 *
 * The following page has information about non-standard character support in member names:
 * - https://rac-wa.atlassian.net/wiki/spaces/DE/pages/3019505722/Name+fields
 *
 * @param memberName
 * @returns sanitized member name
 */
function sanitizeMemberName(memberName: string): string {
  return memberName.trim().replace(NON_STANDARD_HYPHEN_REGEX, "-").replace(NON_STANDARD_SINGLE_QUOTE_REGEX, "'");
}

/**
 * Sanitize membership number:
 * - Remove all whitespace
 * - Remove all standard and non-standard hyphens
 *
 * @param membershipNumber
 * @returns sanitized membership number
 */
function sanitizeMembershipNumber(membershipNumber: string): string {
  return membershipNumber.replace(WHITESPACE_REGEX, "").replace(/-/g, "").replace(NON_STANDARD_HYPHEN_REGEX, "");
}

/**
 * Sanitize policy number:
 * - Removal all whitespace
 * - Strip leading zeros
 * - Uppercase the prefix
 *
 * Insurance policies created prior to Shield migration (2010) can have
 * a shorter policy number length than policies created post-migration.
 * Policy documents sent (usually from ComputerShare CCS) to members often
 * pad the policy number with leading zeros up to a length of 12 characters.
 * Padded zeroes must be stripped from the identifier part of the policy
 * number (Example: MGP000000212 => MGP212) if the member inputs as it is on
 * their policy documents otherwise the Person API match request will fail.
 *
 * @param policyNumber
 * @returns sanitized policy number
 */
function sanitizedPolicyNumber(policyNumber: string): string {
  /** Policy number prefix is always 3 characters long (eg MGP/HGP/MGV/MGC/BGP/PET/MGE) */
  const policyNumberPrefixLength = 3;

  policyNumber = policyNumber.replace(WHITESPACE_REGEX, "");

  if (policyNumber.length <= policyNumberPrefixLength) {
    return policyNumber;
  } else {
    const [prefix, identifier] = [
      policyNumber.substring(0, policyNumberPrefixLength),
      policyNumber.substring(policyNumberPrefixLength),
    ];
    const identifierWithoutLeadingZeros = identifier.replace(/^0+/, "");
    return prefix.toUpperCase().concat(identifierWithoutLeadingZeros);
  }
}

/**
 * Transform date of birth from input format (dd/mm/yyyy)
 * to required format to validate and send to the backend.
 *
 * Person V2 Match API requires date of birth in the format yyyy-mm-dd.
 *
 * Zod z.string().date() method validates in the format YYYY-MM-DD:
 * - https://zod.dev/?id=dates
 *
 * @param dateOfBirth
 * @returns transformed date of birth in correct format for validation and backend
 */
function transformDateOfBirth(dateOfBirth: string): string {
  return dateOfBirth
    .replace(/(^|\/)(\d)(?=\/)/g, "$10$2") // Prepend leading zero to single digit day/month
    .split("/")
    .reverse()
    .join("-");
}

const requiredSchema = z.object({
  firstName: z
    .string({ message: REQUIRED_ERROR_MESSAGE })
    .transform((value) => sanitizeMemberName(value))
    .pipe(
      z.string({ required_error: REQUIRED_ERROR_MESSAGE }).regex(MEMBER_NAME_REGEX, "Please enter a valid first name"),
    ),
  lastName: z
    .string({ message: REQUIRED_ERROR_MESSAGE })
    .transform((value) => sanitizeMemberName(value))
    .pipe(
      z.string({ required_error: REQUIRED_ERROR_MESSAGE }).regex(MEMBER_NAME_REGEX, "Please enter a valid last name"),
    ),
  dateOfBirth: z
    .string({ message: REQUIRED_ERROR_MESSAGE })
    .transform((value) => value.replace(WHITESPACE_REGEX, ""))
    .pipe(
      z
        .string({ required_error: REQUIRED_ERROR_MESSAGE })
        .regex(FORMATTED_DATE_STRING_REGEX, INVALID_DATE_OF_BIRTH_ERROR_MESSAGE)
        .transform((value) => transformDateOfBirth(value)),
    )
    .pipe(z.string({ required_error: REQUIRED_ERROR_MESSAGE }).date(INVALID_DATE_OF_BIRTH_ERROR_MESSAGE)),
});

const identificationMethodSchema = z
  .object({
    identificationMethod: z.nativeEnum(IdentificationMethod),
    mobileNumber: z.optional(
      z
        .string({ message: REQUIRED_ERROR_MESSAGE })
        .transform((value) => value.replace(NON_NUMERIC_REGEX, ""))
        .pipe(
          z
            .string({ required_error: REQUIRED_ERROR_MESSAGE })
            .regex(new RegExp(/^04[0-9]{8}$/), "Please enter a valid mobile number"),
        ),
    ),
    membershipNumber: z.optional(
      z
        .string({ message: REQUIRED_ERROR_MESSAGE })
        .transform((value) => sanitizeMembershipNumber(value))
        .pipe(
          z
            .string({ required_error: REQUIRED_ERROR_MESSAGE })
            .regex(MEMBERSHIP_NUMBER_REGEX, "Please enter a valid membership number"),
        ),
    ),
    // TODO - DED-855 - Discuss min length (3 chars length of prefix) and prefix validation (MGP/HGP/MGV/MGC/BGP/PET/MGE) with UX/PO/BA
    policyNumber: z.optional(
      z
        .string({ message: REQUIRED_ERROR_MESSAGE })
        .transform((value) => sanitizedPolicyNumber(value))
        .pipe(
          z
            .string({ required_error: REQUIRED_ERROR_MESSAGE })
            .regex(new RegExp(/^[A-Z0-9]+$/i), "Please enter a valid insurance policy number"),
        ),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.identificationMethod === IdentificationMethod.Mobile && !data.mobileNumber) {
      ctx.addIssue({
        path: ["mobileNumber"],
        message: REQUIRED_ERROR_MESSAGE,
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.identificationMethod === IdentificationMethod.Membership && !data.membershipNumber) {
      ctx.addIssue({
        path: ["membershipNumber"],
        message: REQUIRED_ERROR_MESSAGE,
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.identificationMethod === IdentificationMethod.Policy && !data.policyNumber) {
      ctx.addIssue({
        path: ["policyNumber"],
        message: REQUIRED_ERROR_MESSAGE,
        code: z.ZodIssueCode.custom,
      });
    }
    return ctx;
  });

export const matchSchema = z.intersection(requiredSchema, identificationMethodSchema);
