import type { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import type { z } from "zod";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "#utils/analyticsTagging";
import { testHelper } from "#utils/testHelper";
import { describe, expect, it, vi } from "vitest";

import ContentfulButton from ".";
import { getButtonData } from "./data";

testHelper.mockEnvironmentVariableProvider();

vi.mock("./data", () => ({
  getButtonData: vi.fn(),
}));
vi.mock("#utils/analyticsTagging", () => ({
  logEvent: vi.fn(),
}));

const regularButton: z.infer<typeof ContentfulButtonSchema> = {
  longText: "Regular Button",
  link: "/",
};

const regularButtonWithTextReplace: z.infer<typeof ContentfulButtonSchema> = {
  longText: "Regular Button",
  link: "{{onlineShopUrl}}",
};

const imageButton: z.infer<typeof ContentfulButtonSchema> = {
  longText: "Image Button",
  link: "/",
  image: [
    {
      secureUrl: "/image",
    },
  ],
  variant: "Image",
};

const iconButton: z.infer<typeof ContentfulButtonSchema> = {
  longText: "Icon Button",
  link: "/",
  icon: "shopping-cart",
  variant: "Icon CTA",
};

const transparentButton: z.infer<typeof ContentfulButtonSchema> = {
  longText: "Transparent Button",
  link: "/",
  variant: "CTA Transparent",
};

const chevronButton: z.infer<typeof ContentfulButtonSchema> = {
  longText: "Chevron Button",
  link: "/",
  variant: "Chevron",
};

describe("Contentful Button", () => {
  it("should render a regular button", async () => {
    vi.mocked(getButtonData).mockReturnValueOnce(Promise.resolve(regularButton));
    render(<>{await ContentfulButton({ id: "1" })}</>);
    const button = screen.getByText("Regular Button");
    await userEvent.click(button);

    expect(vi.mocked(logEvent)).toHaveBeenCalled();
  });

  it("should render a regular button with a replaced link", async () => {
    vi.mocked(getButtonData).mockReturnValueOnce(Promise.resolve(regularButtonWithTextReplace));
    render(<>{await ContentfulButton({ id: "1" })}</>);
    const button = screen.getByText("Regular Button");

    expect(button).toHaveAttribute("href", "test_online_shop_url");
  });

  it("should render an image button", async () => {
    vi.mocked(getButtonData).mockReturnValueOnce(Promise.resolve(imageButton));
    render(<>{await ContentfulButton({ id: "1" })}</>);
    const button = screen.getByText("Image Button");
    // test image is there
    await userEvent.click(button);

    expect(vi.mocked(logEvent)).toHaveBeenCalled();
  });

  it("should render an icon button", async () => {
    vi.mocked(getButtonData).mockReturnValueOnce(Promise.resolve(iconButton));
    render(<>{await ContentfulButton({ id: "1" })}</>);
    const button = screen.getByText("Icon Button");
    const icon = screen.getByRole("img", { hidden: true });

    expect(icon).toBeVisible();

    await userEvent.click(button);

    expect(vi.mocked(logEvent)).toHaveBeenCalled();
  });

  it("should render an transparent button", async () => {
    vi.mocked(getButtonData).mockReturnValueOnce(Promise.resolve(transparentButton));
    render(<>{await ContentfulButton({ id: "1" })}</>);
    const button = screen.getByText("Transparent Button");
    await userEvent.click(button);

    expect(vi.mocked(logEvent)).toHaveBeenCalled();
  });

  it("should render an chevron button", async () => {
    vi.mocked(getButtonData).mockReturnValueOnce(Promise.resolve(chevronButton));
    render(<>{await ContentfulButton({ id: "1" })}</>);
    const button = screen.getByText("Chevron Button");
    const chevron = screen.getByTestId("ChevronRightIcon");

    expect(chevron).toBeVisible();

    await userEvent.click(button);

    expect(vi.mocked(logEvent)).toHaveBeenCalled();
  });
});
