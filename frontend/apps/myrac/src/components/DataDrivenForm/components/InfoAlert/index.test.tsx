import { render, screen } from "@testing-library/react";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");

const testSchema = [
  {
    name: "info",
    component: "info-alert",
    helperText: "As written on your driver's licence or passport.",
    validate: [],
    richText: {
      json: {
        data: {},
        content: [
          {
            data: {},
            content: [
              {
                data: {},
                marks: [
                  {
                    type: "bold",
                  },
                ],
                value: "Please use your legal name",
                nodeType: "text",
              },
            ],
            nodeType: "paragraph",
          },
        ],
        nodeType: "document",
      },
    },
  },
];

describe("Info Alert", () => {
  it("should render component", () => {
    render(<TestFormRenderer fields={testSchema} />);

    expect(screen.getByText("Please use your legal name")).toBeVisible();
    expect(screen.getByText("As written on your driver's licence or passport.")).toBeVisible();
  });
});
