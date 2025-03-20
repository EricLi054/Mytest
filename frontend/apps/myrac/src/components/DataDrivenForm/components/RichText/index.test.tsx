import { render, screen } from "@testing-library/react";
import { TestFormRenderer } from "#components/DataDrivenForm/testHelper";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");

const testSchema = [
  {
    name: "payment-info",
    component: "rich-text",
    richText: {
      json: {
        nodeType: "document",
        data: {},
        content: [
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: "To update payments for your insurance, roadside assistance or Rewards membership:",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                data: {},
              },
            ],
          },
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: " ",
                marks: [],
                data: {},
              },
            ],
          },
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: "1. Go to ",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                data: {},
              },
              {
                nodeType: "hyperlink",
                data: {
                  uri: "/myrac",
                },
                content: [
                  {
                    nodeType: "text",
                    value: "myRAC homepage",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    data: {},
                  },
                ],
              },
              {
                nodeType: "text",
                value: ".",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                data: {},
              },
            ],
          },
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: "2. Select the item you'd like to update.",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                data: {},
              },
            ],
          },
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: "3. Select 'Manage'.",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                data: {},
              },
            ],
          },
        ],
      },
    },
  },
];

describe("Rich Text", () => {
  it("should render rich text", () => {
    render(<TestFormRenderer fields={testSchema} />);

    expect(
      screen.getByText("To update payments for your insurance, roadside assistance or Rewards membership:"),
    ).toBeVisible();

    expect(screen.getByRole("link", { name: "myRAC homepage" })).toBeVisible();
  });
});
