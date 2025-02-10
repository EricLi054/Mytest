import { type HttpError, type UnauthorizedAccessError } from '@/graphql/contracts';

export interface DigitalCardDetailsValue {
  digitalCardPassId: string;
  digitalCardPassIsActive: boolean;
  digitalCardPassUrl: string;
  numberOfPassesInstalled: number;
}

export interface DigitalCardDetails {
  isSuccess: boolean;
  value: DigitalCardDetailsValue;
  errors?: null | Array<HttpError | UnauthorizedAccessError>;
}
