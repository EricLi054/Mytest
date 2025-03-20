import type { Mock } from "vitest";
import { expect } from "vitest";

import { gtm } from "@racwa/analytics";

export const expectGtmPageView = (url: string, title: string) => {
  expect(gtm as Mock).toHaveBeenCalledWith(
    expect.objectContaining({
      event: "virtualPageView",
      page: { url, title },
    }),
  );
};

export const expectGtmFieldTouched = (field: string) => {
  expect(gtm as Mock).toHaveBeenCalledWith(
    expect.objectContaining({
      event: "fieldTouched",
      field,
    }),
  );
};

export const expectGtmCustomEvent = (description: string) => {
  expect(gtm as Mock).toHaveBeenCalledWith(
    expect.objectContaining({
      event: "customevent",
      description,
    }),
  );
};
