import type { Meta } from "@storybook/react";
import { Box } from "@mui/material";

import DigitalCardBack from "./";
import BarcodeClient from "./Barcode";

export default {
  title: "MyRAC/Components/Digital Card/Digital Card Back",
  component: DigitalCardBack,
  subcomponents: { BarcodeClient },
  tags: ["@racwa/myrac"],
} as Meta<typeof DigitalCardBack>;

export const Default = () => {
  return (
    <Box sx={{ maxWidth: "300px" }}>
      <DigitalCardBack membershipCardNumber="1231231231231231" />
    </Box>
  );
};
