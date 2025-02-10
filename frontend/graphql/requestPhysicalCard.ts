import { type HttpError, type UnauthorizedAccessError, type ValidationError } from './contracts';
import getData from './getData';

export interface RequestPhysicalCardResponse {
  errors?: null | Array<HttpError | UnauthorizedAccessError | ValidationError>;
  physicalCardResponse?: { isSuccess: boolean; errors: string[] | null; value: string | null };
}

export interface RequestPhysicalCardMutationResponse {
  requestPhysicalCard?: RequestPhysicalCardResponse;
}

const query = `
mutation requestPhysicalCard ($input: RequestPhysicalCardInput!) {
  requestPhysicalCard(input: $input) {
    physicalCardResponse {
      errors
      isSuccess
      value
    }
    errors {
      ... on HttpError {
        errorCode
        message
      }
      ... on UnauthorizedAccessError {
        message
      }
      ... on ValidationError {
        fieldName
        message
      }
    }
  }
}
    `;

const variables = (crmId: string) => ({
  input: {
    request: { memberId: crmId }
  }
});

const requestPhysicalCard = async (
  crmId: string,
  token: string | null = null
): Promise<null | RequestPhysicalCardResponse> => {
  const result: RequestPhysicalCardMutationResponse = await getData(query, token, variables(crmId));

  if (!result?.requestPhysicalCard) {
    throw new Error(`Error: request physical card failed with no result`);
  }
  return result.requestPhysicalCard;
};

export default requestPhysicalCard;
