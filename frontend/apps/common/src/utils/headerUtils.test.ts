import { beforeEach, describe, expect, it, vi } from "vitest";

import { getContentfulPreviewHeader } from "./headerUtils";

const CONTENT_PREVIEW_HEADER = "Preview_Content";

let mockedHeaders = new Map();

vi.mock("next/headers", () => {
  return {
    headers: () => {
      return mockedHeaders;
    },
  };
});

describe("getContentfulPreviewHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedHeaders.clear();
  });

  it(`should return true when the ${CONTENT_PREVIEW_HEADER} header is set to "true"`, async () => {
    mockedHeaders = new Map([[CONTENT_PREVIEW_HEADER, "true"]]);

    expect(await getContentfulPreviewHeader()).toBe(true);
  });

  it(`should return false when the ${CONTENT_PREVIEW_HEADER} header is not set to "true"`, async () => {
    mockedHeaders = new Map([[CONTENT_PREVIEW_HEADER, "false"]]);

    expect(await getContentfulPreviewHeader()).toBe(false);
  });

  it(`should return false when the ${CONTENT_PREVIEW_HEADER} header is not present`, async () => {
    expect(await getContentfulPreviewHeader()).toBe(false);
  });
});
