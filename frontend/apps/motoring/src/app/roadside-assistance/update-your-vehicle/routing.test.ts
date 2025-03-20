import { describe, expect, it } from "vitest";

import type { UpdateYourVehiclePage } from "./routing";
import { getUpdateYourVehiclePageUrl, getUpdateYourVehicleTimeoutUrl } from "./routing";

const absolutePath = (suffix?: string) => `/roadside-assistance/update-your-vehicle${suffix ?? ""}`;

describe("getUpdateYourVehiclePageUrl", () => {
  it.each([
    "/your-vehicle",
    "/update-vehicle",
    "/confirm-vehicle",
    "/confirmation",
    "/system-unavailable",
    "/session-timeout",
  ] satisfies Exclude<UpdateYourVehiclePage["formPage" | "errorPage"], "/">[])(
    "should return absolute UpdateYourVehicle path with trailing page when page is %s",
    (page) => {
      expect(getUpdateYourVehiclePageUrl({ page })).toBe(absolutePath(page));
    },
  );

  it("should return absolute UpdateYourVehicle path without trailing slash when page is /", () => {
    expect(getUpdateYourVehiclePageUrl({ page: "/" })).toBe(absolutePath());
  });
});

describe("getSessionTimeoutUrl", () => {
  it("should return absolute UpdateYourVehicle path with previousPage query when previousPage is provided", () => {
    const previousPage = "/your-vehicle";
    const expectedUrl = `${absolutePath("/session-timeout")}?previousPage=${encodeURIComponent(previousPage)}`;

    expect(getUpdateYourVehicleTimeoutUrl({ previousPage })).toBe(expectedUrl);
  });

  it("should return absolute UpdateYourVehicle path without previousPage query when previousPage is not provided", () => {
    const expectedUrl = absolutePath("/session-timeout");

    expect(getUpdateYourVehicleTimeoutUrl({})).toBe(expectedUrl);
  });
});
