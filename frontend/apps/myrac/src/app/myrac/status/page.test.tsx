import type { z } from "zod";
import { render, screen } from "@testing-library/react";
import { MyRACThemeProvider } from "#theme";
import { describe, expect, it, vi } from "vitest";

import type { StatusSchema } from "./data";
import { getStatusInformation } from "./data";
import Status from "./page";

vi.mock("./data", () => ({
  getStatusInformation: vi.fn(),
}));

describe("myRAC Status", () => {
  it("should render status page", async () => {
    const mockInfo: z.infer<typeof StatusSchema>[] = [
      {
        name: "Person v2",
        status: "HEALTHY",
      },
      {
        name: "Finance",
        status: "DOWN",
      },
    ];
    vi.mocked(getStatusInformation).mockReturnValueOnce(Promise.resolve(mockInfo));
    render(
      <MyRACThemeProvider>
        <>{await Status()}</>
      </MyRACThemeProvider>,
    );

    expect(screen.getByText("Person v2")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Down")).toBeInTheDocument();
  });

  it("should throw error with no response status page", async () => {
    vi.mocked(getStatusInformation).mockReturnValueOnce(Promise.resolve(null));

    render(
      <MyRACThemeProvider>
        <>{await Status()}</>
      </MyRACThemeProvider>,
    );

    expect(screen.getByText("Unable to check system status")).toBeInTheDocument();
  });
});
