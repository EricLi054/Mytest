import { render, screen } from "@testing-library/react";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");

const testMustacheSchema = [
  {
    name: "email-display",
    component: "plain-text",
    label: "{{person.PersonalEmailAddress}}",
    sx: {
      fontWeight: 400,
    },
  },
];

const testPlainSchema = [
  {
    name: "email-label",
    component: "plain-text",
    label: "Contact Email",
  },
];

describe("Plain text", () => {
  it("should render component with replaced text", () => {
    render(<TestFormRenderer fields={testMustacheSchema} />);

    expect(screen.getByText("test@test.com")).toBeVisible();
  });

  it("should render component with no change", () => {
    render(<TestFormRenderer fields={testPlainSchema} />);

    expect(screen.getByText("Contact Email")).toBeVisible();
  });
});
