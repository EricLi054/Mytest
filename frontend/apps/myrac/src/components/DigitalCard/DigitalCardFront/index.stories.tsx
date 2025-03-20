import { Box } from "@mui/material";

import DigitalCardFront from ".";

export default {
  title: "MyRAC/Components/Digital Card/Digital Card Front",
  component: DigitalCardFront,
  tags: ["@racwa/myrac"],
};

export const Default = () => {
  return (
    <Box sx={{ maxWidth: "300px" }}>
      <DigitalCardFront
        person={{
          title: "Mr",
          firstName: "John",
          surname: "Doe",
          cardColour: "Gold",
          racId: "123456",
          membershipCardNumber: "1231231231231231",
          membershipType: "Standard",
          tier: "Gold",
        }}
      />
    </Box>
  );
};
