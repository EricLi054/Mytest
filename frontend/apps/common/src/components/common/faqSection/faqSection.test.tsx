import { render, screen } from "@testing-library/react";
import { TestFAQ } from "#testing/data/websiteTestData";
import { describe, expect, it } from "vitest";

import ContactUsFAQ from "./faqSection";

describe("FAQ", () => {
  it("should render the FAQ heading and question urls", () => {
    render(<ContactUsFAQ faqs={TestFAQ} />);

    expect(screen.getByText("Frequently Asked Questions")).toBeVisible();
    expect(screen.getByText("How do I do A?")).toBeVisible();
  });
});
