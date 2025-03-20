import { render, screen } from "@testing-library/react";
import { clientEnv } from "#env/client";
import { describe, expect, it, vi } from "vitest";

import { EnvironmentVariableProvider } from ".";
import { useEnvironmentVariables } from "./context";

vi.mock("server-only", () => ({}));
const TestComponent = () => {
  const env = useEnvironmentVariables();
  return (
    <div>
      <p>{env.B2C_URL}</p>
      <p>{env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}</p>
      <p>{env.ONLINE_SHOP_URL}</p>
    </div>
  );
};

describe("Environment Variable Provider", () => {
  it("should throw an error if used outside of EnvironmentVariableProvider", () => {
    expect(() => render(<TestComponent />)).toThrow(
      "useEnvironmentVariables must be used within a EnvironmentVariableProvider",
    );
  });

  it("should get environment variables", () => {
    render(
      <EnvironmentVariableProvider variables={clientEnv()}>
        <TestComponent />
      </EnvironmentVariableProvider>,
    );

    expect(screen.getByText("test_b2c_url")).toBeVisible();
    expect(screen.getByText("dltdv24vg")).toBeVisible();
    expect(screen.getByText("test_online_shop_url")).toBeVisible();
  });
});
