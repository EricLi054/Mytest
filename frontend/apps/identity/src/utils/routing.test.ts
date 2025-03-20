import { describe, expect, it } from "vitest";

import type { RegistrationPage } from "./routing";
import { getRegistrationErrorPageUrl, getRegistrationPageUrl } from "./routing";

const absolutePath = (suffix?: string) => `/register${suffix ?? ""}`;

describe("getRegistrationPageUrl", () => {
  it.each(["/match", "/link-member"] satisfies Exclude<RegistrationPage["formPage"], "/">[])(
    "should return absolute Registration path with trailing page when page is %s",
    (page) => {
      expect(getRegistrationPageUrl({ page })).toBe(absolutePath(page));
    },
  );

  it("should return absolute Registration path without trailing slash when page is /", () => {
    expect(getRegistrationPageUrl({ page: "/" })).toBe(absolutePath());
  });
});

describe("getRegistrationErrorPageUrl", () => {
  it.each(["/system-unavailable", "/session-timeout", "/cant-find-you"] satisfies RegistrationPage["errorPage"][])(
    "should return Registration error page for %s",
    (page) => {
      expect(getRegistrationErrorPageUrl({ page })).toBe(`/register/error${page}`);
    },
  );
});
