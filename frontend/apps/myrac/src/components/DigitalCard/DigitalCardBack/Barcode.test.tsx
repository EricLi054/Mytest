import React from "react";
import { render, screen } from "@testing-library/react";
import JsBarcode from "jsbarcode";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BarcodeClient from "./Barcode";

vi.mock("jsbarcode");

describe("BarcodeClient", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render the SVG element", () => {
    render(<BarcodeClient membershipCardNumber="1234567890123" />);
    const svgElement = screen.getByTestId("barcode");

    expect(svgElement).toBeInTheDocument();
  });

  it("should call JsBarcode with correct arguments when barcode length is 16", () => {
    const barcode = "1234567890123456";
    render(<BarcodeClient membershipCardNumber={barcode} />);

    expect(JsBarcode).toHaveBeenCalledWith("#barcode", barcode, {
      format: "code128b",
      displayValue: false,
      lineColor: "black",
      background: "white",
    });
  });

  it("should not call JsBarcode when barcode length is not 13", () => {
    render(<BarcodeClient membershipCardNumber="123" />);

    expect(JsBarcode).not.toHaveBeenCalled();
  });
});
