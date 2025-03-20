import { INVALID_ERROR, REQUIRED_ERROR } from "../constants";

type GetHelperTextArgs = {
  errors?: string[];
  requiredMessage: string;
  invalidMessage: string;
};

/**
 * Returns a helper text based on the error message.
 *
 * @param error - The error message to evaluate.
 * @param requiredMessage - The message to return if the error indicates a required field.
 * @param invalidMessage - The message to return if the error indicates an invalid field.
 * @returns The appropriate helper text based on the error message.
 */
export const getHelperText = ({ errors, requiredMessage, invalidMessage }: GetHelperTextArgs) => {
  if (errors?.includes(REQUIRED_ERROR)) {
    return requiredMessage;
  }

  if (errors?.includes(INVALID_ERROR)) {
    return invalidMessage;
  }

  return undefined;
};
