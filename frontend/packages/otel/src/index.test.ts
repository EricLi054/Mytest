import { describe, expect, it, vi } from "vitest";

import * as otel from "./index";

vi.mock("@azure/monitor-opentelemetry");
vi.mock("@opentelemetry/instrumentation");

describe("init", () => {
  it("should be called with param", () => {
    const param = "testParam";
    const initSpy = vi.spyOn(otel, "init");
    otel.init(param);

    expect(initSpy).toHaveBeenCalledWith(param);
  });
});
