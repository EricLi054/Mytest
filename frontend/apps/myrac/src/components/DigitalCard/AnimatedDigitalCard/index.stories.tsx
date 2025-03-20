import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { Box, Typography } from "@mui/material";

import AnimatedDigitalCard from ".";

export default {
  title: "MyRAC/Components/Digital Card/Animated Digital Card",
  component: AnimatedDigitalCard,
  tags: ["@racwa/myrac"],
};

const person: z.infer<typeof PersonSchema> = {
  title: "Mr",
  firstName: "John",
  surname: "Doe",
  cardColour: "Gold",
  racId: "123456",
  membershipCardNumber: "1231231231231231",
  membershipType: "Gold",
  tier: "Gold",
};

export const Default = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
      <AnimatedDigitalCard person={person} />
      <Typography variant="caption">Switch to mobile view to test swipe gestures</Typography>
    </Box>
  );
};
