export const RAC_DEFAULT_HELP_NUMBER_DISPLAY_FORMAT = "13 17 03";
export const RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT = "1300 045 617";

export const EMPTY_URL = "about:blank";

export const REQUIRED_ERROR_MESSAGE = "This field is required";
export const INVALID_DATE_OF_BIRTH_ERROR_MESSAGE = "Please enter a valid date of birth (dd/mm/yyyy)";

/**
 * Format to match date-fns:
 * -  https://date-fns.org/v4.1.0/docs/format
 * -  https://date-fns.org/v4.1.0/docs/parse
 */
export const DATE_STRING_FORMAT = "dd/MM/yyyy";

/**
 * Matches any whitespace characters (spaces, tabs, newlines, etc).
 */
export const WHITESPACE_REGEX = new RegExp(/\s+/g);

/**
 * Matches any non-numeric characters.
 */
export const NON_NUMERIC_REGEX = new RegExp(/[^0-9]/g);

/**
 * Matches date string in the format dd/mm/yyyy.
 */
export const FORMATTED_DATE_STRING_REGEX = new RegExp(/^\d{1,2}\/\d{1,2}\/\d{4}$/);

/**
 * Maximum field length for first name based on Member Central (CE) column on the following page:
 * - https://rac-wa.atlassian.net/wiki/spaces/DE/pages/3019505722/Name+fields
 */
export const MAX_FIRST_NAME_LENGTH = 50;

/**
 * Maximum field length for last name based on Member Central (CE) column on the following page:
 * - https://rac-wa.atlassian.net/wiki/spaces/DE/pages/3019505722/Name+fields
 */
export const MAX_LAST_NAME_LENGTH = 55;

/**
 * Maximum field length for membership number on Member Central (CE) column on the following page:
 * - https://rac-wa.atlassian.net/wiki/spaces/DE/pages/3019505769/Membership+details
 */
export const MAX_MEMBERSHIP_NUMBER_LENGTH = 50;

/**
 * Maximum field length for insurance policy number based on largest theoretical policy number advised by Shield team.
 * Data validation rules for insurance policy number don not exist in any child pages that exist under the following page:
 * - https://rac-wa.atlassian.net/wiki/spaces/DE/pages/3019505685/Data+Validation+Rules
 */
export const MAX_INSURANCE_POLICY_NUMBER_LENGTH = 15;
