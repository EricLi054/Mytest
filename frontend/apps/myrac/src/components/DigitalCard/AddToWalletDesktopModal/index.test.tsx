import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AddToWalletDesktopModal from "./";

describe("QRCodeModalContent", () => {
  it("should render the modal content with rendered qr code", () => {
    render(<AddToWalletDesktopModal digitalCardUrl="https://digital-card-url" />);

    expect(screen.getByText("To add to your mobile wallet")).toBeVisible();

    const qrcode = screen.getByRole("img", { name: "Get your digital card" });

    expect(qrcode).toBeVisible();
  });
});
