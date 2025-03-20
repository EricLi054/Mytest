import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "./not-found";

describe("Not Found Page", () => {
  it("should render the Not Found Page", () => {
    render(<NotFound />);

    expect(screen.getByText("We seem to be missing some parts")).toBeInTheDocument();
    expect(screen.getByText("Sorry, we can't find the page that you're looking for.")).toBeInTheDocument();
  });

  it("should render the 'Back to RAC' button", () => {
    render(<NotFound />);

    expect(screen.getByText("Back to RAC")).toBeInTheDocument();
  });
});
