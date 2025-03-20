import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CldImage } from ".";

describe("CldImage", () => {
  it("should be able to render", () => {
    render(
      <CldImage
        src="https://res.rac.com.au/rac-horizons/image/upload/v1740035397/rac_logo_jvczlw.png"
        alt="RAC Logo"
        title="RAC Logo"
        width={51}
        height={44}
      />,
    );

    expect(screen.getByAltText("RAC Logo")).toBeVisible();
  });
});
