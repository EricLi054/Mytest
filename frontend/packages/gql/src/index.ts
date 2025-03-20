import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

export type ExecuteProps<Result, Variables> = {
  endpoint: string;
  sourceSystem: "common" | "identity" | "motoring" | "myRAC";
  token?: string;
  query: TypedDocumentNode<Result, Variables>;
  variables: Variables;
  headers?: Record<string, string>;
};

export type ExecuteResponse<Result> = {
  data: Result;
  errors?: Error[];
};

export async function execute<Result, Variables>({
  endpoint,
  sourceSystem,
  token,
  query,
  variables,
  headers = {},
}: ExecuteProps<Result, Variables>): Promise<ExecuteResponse<Result>> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      SourceSystem: sourceSystem,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
  });
  return (await response.json()) as ExecuteResponse<Result>;
}
