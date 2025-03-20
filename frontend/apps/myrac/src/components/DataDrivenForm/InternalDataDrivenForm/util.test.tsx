import type { z } from "zod";
import { updatePerson } from "#graphql/person/mutations";
import { describe, expect, it, vi } from "vitest";

import type { FormApi } from "./schema";
import { onSubmit } from "./util";

vi.mock("server-only", () => ({}));
vi.mock("#graphql/person/mutations", () => ({
  updatePerson: vi.fn(),
}));

const getMockedState = (modified: boolean) => {
  return {
    active: undefined,
    dirty: true,
    dirtyFields: { testFieldName: true },
    dirtyFieldsSinceLastSubmit: { testFieldName: true },
    dirtySinceLastSubmit: true,
    error: null,
    errors: [],
    hasSubmitErrors: false,
    hasValidationErrors: false,
    initialValues: { testFieldName: "initial" },
    invalid: false,
    modified: modified ? { testFieldName: true } : null,
    modifiedSinceLastSubmit: true,
    pristine: false,
    submitError: null,
    submitErrors: [],
    submitFailed: false,
    submitSucceeded: false,
    submitting: true,
    touched: { testFieldName: true },
    valid: true,
    validating: false,
    values: { testFieldName: "current" },
  };
};

const getMockedFieldState = () => {
  return {
    blur: () => {
      console.log("blur");
    },
    change: () => {
      console.log("change");
    },
    focus: () => {
      console.log("focus");
    },
    name: "testFieldName",
    value: "current",
  };
};

const getStateMock = vi.fn();
const getFieldStateMock = vi.fn();

const mockFormApi: z.infer<typeof FormApi> = {
  getState: getStateMock,
  getFieldState: getFieldStateMock,
};

describe("Form On Submit", () => {
  it("should return false with nothing modified", async () => {
    getStateMock.mockReturnValueOnce(getMockedState(false));

    expect(await onSubmit(null, mockFormApi)).toBeFalsy();
  });

  it("should return submit with correct values", async () => {
    getStateMock.mockReturnValueOnce(getMockedState(true));
    getFieldStateMock.mockReturnValueOnce(getMockedFieldState());

    await onSubmit(null, mockFormApi);

    expect(updatePerson).toHaveBeenCalledWith({
      person: {
        request: { testFieldName: "current" },
      },
    });
  });

  it("should return false with failed submission", async () => {
    getStateMock.mockReturnValueOnce(getMockedState(true));
    getFieldStateMock.mockReturnValueOnce(getMockedFieldState());
    vi.mocked(updatePerson).mockResolvedValueOnce(false);

    expect(await onSubmit(null, mockFormApi)).toBeFalsy();
  });

  it("should return true with successful submission", async () => {
    getStateMock.mockReturnValueOnce(getMockedState(true));
    getFieldStateMock.mockReturnValueOnce(getMockedFieldState());
    vi.mocked(updatePerson).mockResolvedValueOnce(true);

    expect(await onSubmit(null, mockFormApi)).toBeTruthy();
  });
});
