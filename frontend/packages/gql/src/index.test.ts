import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ExecuteProps } from "./index";
import { execute } from "./index";

type MockResult = { mocked: string };
type MockVariables = { var1: string };

const endpoint = "http://supergraph-gateway/graphql";
const mockedQuery = "mocked query";
const mockedVariables = { var1: "value1" };
const mockedExecuteResponse = { data: { mocked: "response" } };
const expectedBody = JSON.stringify({
  query: mockedQuery,
  variables: mockedVariables,
});

vi.mock("graphql", () => ({
  print: vi.fn(() => mockedQuery),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockedExecuteResponse),
  } as Response),
);

describe("execute", () => {
  const defaultProps: ExecuteProps<MockResult, MockVariables> = {
    endpoint,
    sourceSystem: "common",
    query: {
      kind: "Document",
      definitions: [],
    } as TypedDocumentNode<MockResult, MockVariables>,
    variables: mockedVariables,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set the default headers and make a POST request", async () => {
    const response = await execute(defaultProps);

    expect(response).toEqual(mockedExecuteResponse);
    expect(fetch).toHaveBeenCalledWith(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SourceSystem: "common",
      },
      body: expectedBody,
    });
  });

  it("should set Authorization header if token prop is defined", async () => {
    const props: ExecuteProps<MockResult, MockVariables> = {
      ...defaultProps,
      token: "mockedToken",
    };

    const response = await execute(props);

    expect(response).toEqual(mockedExecuteResponse);
    expect(fetch).toHaveBeenCalledWith(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SourceSystem: "common",
        Authorization: "Bearer mockedToken",
      },
      body: expectedBody,
    });
  });

  it("should set custom headers", async () => {
    const props: ExecuteProps<MockResult, MockVariables> = {
      ...defaultProps,
      headers: { "Custom-Header": "CustomValue" },
    };

    const response = await execute(props);

    expect(response).toEqual(mockedExecuteResponse);
    expect(fetch).toHaveBeenCalledWith(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SourceSystem: "common",
        "Custom-Header": "CustomValue",
      },
      body: expectedBody,
    });
  });

  it("should not set custom headers when custom header key matches default header key", async () => {
    const props: ExecuteProps<MockResult, MockVariables> = {
      ...defaultProps,
      token: "mockedToken",
      headers: { Authorization: "CustomAuthorization", SourceSystem: "CustomSourceSystem" },
    };

    const response = await execute(props);

    expect(response).toEqual(mockedExecuteResponse);
    expect(fetch).toHaveBeenCalledWith(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SourceSystem: "common",
        Authorization: "Bearer mockedToken",
      },
      body: expectedBody,
    });
  });
});
