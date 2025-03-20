import { render, screen } from "@testing-library/react";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");

const testMustacheSchema = [
  {
    name: "login-email",
    component: "redirect-edit",
    label: "Log-in email",
    link: "/oidc/updateEmail",
    content: "{{loginEmail}}",
  },
];

const testPlainSchema = [
  {
    name: "password",
    component: "redirect-edit",
    label: "Password",
    link: "/oidc/updatePassword",
    content: "**********",
  },
];

describe("Redirect Edit", () => {
  it("should render component with replaced text", () => {
    render(<TestFormRenderer fields={testMustacheSchema} />);

    expect(screen.getByText("test@test.com")).toBeVisible();

    expect(screen.getByRole("link", { name: "Edit" })).toHaveProperty(
      "href",
      expect.stringContaining("/oidc/updateEmail"),
    );
  });

  it("should render component with no change", () => {
    render(<TestFormRenderer fields={testPlainSchema} />);

    expect(screen.getByText("**********")).toBeVisible();

    expect(screen.getByRole("link", { name: "Edit" })).toHaveProperty(
      "href",
      expect.stringContaining("/oidc/updatePassword"),
    );
  });
});
