import { render } from "@testing-library/react";
import { TestCategory } from "#testing/data/testData";
import { describe, expect, it } from "vitest";

import AccentBorder from ".";

describe("AccentBorder", () => {
  it("should be able to render", () => {
    const mockCategory = TestCategory;
    const view = render(<AccentBorder category={mockCategory} />);

    expect(view).toBeDefined();
  });
});
