import { render, screen } from "@testing-library/react";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");

const testMustacheSchema = [
  {
    name: "mobile-display",
    component: "fixed-label-plain-text",
    label: "Mobile {{#if person.MobilePhone}}{{person.MobilePhone}}{{else}}Not Provided{{/if}}",
    fixedLabelWidth: "70px",
    sx: {
      fontWeight: 400,
    },
  },
];

const testPlainSchema = [
  {
    name: "mobile-display",
    component: "fixed-label-plain-text",
    label: "Mobile nothing to replace",
    fixedLabelWidth: "100px",
    sx: {
      fontWeight: 400,
    },
  },
];

const testOneWordSchema = [
  {
    name: "mobile-display",
    component: "fixed-label-plain-text",
    label: "OneWord",
    fixedLabelWidth: "100px",
    sx: {
      fontWeight: 400,
    },
  },
];

describe("Fixed Label Plain text", () => {
  it("should render component with replaced text", () => {
    render(<TestFormRenderer fields={testMustacheSchema} />);

    const label = screen.getByText("Mobile");

    expect(label).toBeVisible();
    expect(label).toHaveStyle({ width: "70px" });
    expect(screen.getByText("0400123456")).toBeVisible();
  });

  it("should render component with no change", () => {
    render(<TestFormRenderer fields={testPlainSchema} />);
    const label = screen.getByText("Mobile");

    expect(label).toBeVisible();
    expect(label).toHaveStyle({ width: "100px" });
    expect(screen.getByText("nothing to replace")).toBeVisible();
  });

  it("should render with only a label", () => {
    render(<TestFormRenderer fields={testOneWordSchema} />);

    expect(screen.getByText("OneWord")).toBeVisible();
  });
});
