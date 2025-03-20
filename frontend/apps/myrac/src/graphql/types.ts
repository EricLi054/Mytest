export type HttpError = {
  errorCode: string;
  message: string;
  __typename: "HttpError";
};

export type UnauthorizedAccessError = {
  message: string;
};

export type ValidationError = {
  fieldName: string;
  message: string;
};
