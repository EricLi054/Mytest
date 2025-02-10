export interface HttpError {
  errorCode: string;
  message: string;
  __typename: 'HttpError';
}

export interface UnauthorizedAccessError {
  message: string;
}

export interface ValidationError {
  fieldName: string;
  message: string;
}
