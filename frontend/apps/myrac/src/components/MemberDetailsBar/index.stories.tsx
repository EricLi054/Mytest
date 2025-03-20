import type { Meta } from "@storybook/react";
import { Grid2 as Grid } from "@mui/material";
import { EnvironmentVariableProvider } from "#providers/environmentVariables";
import { ModalProvider } from "#providers/modal";

import type { DigitalCardDetails, Person } from "./types";
import MemberDetailsBar from ".";

export default {
  title: "MyRAC/Components/Member Details Bar",
  component: MemberDetailsBar,
  tags: ["@racwa/myrac"],
  decorators: [
    (Story) => (
      <div style={{ height: "100vh", width: "100%" }}>
        <EnvironmentVariableProvider
          variables={{ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "", ONLINE_SHOP_URL: "", B2C_URL: "" }}
        >
          <Story />
        </EnvironmentVariableProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof MemberDetailsBar>;

const getPerson = (cardColour: string, tier: string): Person => {
  return {
    title: "Mr",
    firstName: "Test",
    surname: "Tester",
    racId: "12345678",
    cardColour,
    tier,
    membershipCardNumber: "1234567890123456",
    membershipType: "Standard",
  };
};

const getDigitalCardDetails = (): DigitalCardDetails => {
  return {
    id: "12345",
    passId: "12345",
    isActive: true,
    passUrl: "https://digital-card-link",
    numberOfPassesInstalled: 0,
  };
};

export const MemberDetailsBlue = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("Blue", "Blue")} />
    </Grid>
  );
};

export const MemberDetailsRed = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("Red", "Red")} />
    </Grid>
  );
};

export const MemberDetailsBronze = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("Bronze", "Bronze")} />
    </Grid>
  );
};

export const MemberDetailsSilver = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("Silver", "Silver")} />
    </Grid>
  );
};

export const MemberDetailsGold = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("Gold", "Staff")} />
    </Grid>
  );
};

export const MemberDetailsFree2Go = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("Free2Go", "Free2Go")} />
    </Grid>
  );
};

export const MemberDetailsRacIgnite = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("RAC Ignite", "RAC Ignite")} />
    </Grid>
  );
};

export const MemberDetailsGoldLife = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("Gold Life", "Gold")} />
    </Grid>
  );
};

export const MemberDetailsNone = () => {
  return (
    <Grid height="100%" marginTop={10}>
      <MemberDetailsBar person={getPerson("", "None")} />
    </Grid>
  );
};

export const MemberDetailsDigitalCard = () => {
  const person = {
    ...getPerson("Gold Life", "Gold"),
    digitalCardDetails: getDigitalCardDetails(),
  };

  return (
    <Grid height="100%" marginTop={10}>
      <ModalProvider>
        <MemberDetailsBar person={person} />
      </ModalProvider>
    </Grid>
  );
};
