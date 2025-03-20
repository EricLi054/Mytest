import { expect } from "vitest";

import { mockGtm } from "../../setupTests";

const customEvent = "customevent";

export const expectGtmCalledTimes = (times: number) => {
  expect(mockGtm).toHaveBeenCalledTimes(times);
};

export const expectGtmCustomEvent = (description: string) => {
  expect(mockGtm).toHaveBeenCalledWith(
    expect.objectContaining({
      event: customEvent,
      description,
    }),
  );
};

export const expectGtmCustomEventWithDescriptionContaining = (partialDescription: string) => {
  expect(mockGtm).toHaveBeenCalledWith(
    expect.objectContaining({
      event: customEvent,
      description: expect.stringContaining(partialDescription) as string,
    }),
  );
};

export const expectGtmCustomEventToNotHaveBeenCalled = () => {
  expect(mockGtm).not.toHaveBeenCalledWith(
    expect.objectContaining({
      event: customEvent,
    }),
  );
};
