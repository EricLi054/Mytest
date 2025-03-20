"use client";

import { useEffect } from "react";
import { styled } from "@mui/material";
import JsBarcode from "jsbarcode";

const StyledSvg = styled("svg")(() => ({
  width: "100%",
  height: "auto",
}));

const BarcodeClient = ({ membershipCardNumber }: { membershipCardNumber: string }) => {
  useEffect(() => {
    if (!membershipCardNumber || membershipCardNumber.length !== 16) return;

    JsBarcode("#barcode", membershipCardNumber, {
      format: "code128b",
      displayValue: false,
      lineColor: "black",
      background: "white",
    });
  }, [membershipCardNumber]);

  return <StyledSvg id="barcode" data-testid="barcode" />;
};

export default BarcodeClient;
