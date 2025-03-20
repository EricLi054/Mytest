import type { Meta } from "@storybook/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronRight, faIdCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { Grid2 as Grid } from "@mui/material";
import { EnvironmentVariableProvider } from "#providers/environmentVariables";

import InternalContentfulButton from "../ContentfulButton/InternalContentfulButton";
import InternalButtonContainer from "./InternalButtonContainer";

library.add(faUser);
library.add(faIdCard);
library.add(faChevronRight);

export default {
  title: "MyRAC/Components/Server Components/Button Container",
  component: InternalButtonContainer,
  tags: ["@racwa/myrac"],
  decorators: [
    (Story) => (
      <EnvironmentVariableProvider
        variables={{ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "", ONLINE_SHOP_URL: "", B2C_URL: "" }}
      >
        <Story />
      </EnvironmentVariableProvider>
    ),
  ],
} satisfies Meta<typeof InternalButtonContainer>;

export const ProfileButtons = () => {
  return (
    <InternalButtonContainer stackTogether={true} gap={3} itemsPerRow={2} largeWidth={95} columnBreakpoint="sm">
      <InternalContentfulButton
        longText="Contact details"
        shortText="Including login details"
        link="#"
        icon="user"
        variant="Profile Link"
      />
      <InternalContentfulButton
        longText="Membership"
        shortText="Card and details"
        link="#"
        icon="id-card"
        variant="Profile Link"
      />
      <InternalContentfulButton longText="Test" shortText="Test Card" link="#" icon="id-card" variant="Profile Link" />
    </InternalButtonContainer>
  );
};

export const MyRACOtherTasks = () => {
  return (
    <Grid textAlign="center">
      <InternalButtonContainer stackTogether={false} gap={2} itemsPerRow={4} largeWidth={120} columnBreakpoint="md">
        <InternalContentfulButton longText="Update your details" link="#" variant="Regular" />
        <InternalContentfulButton longText="View your member benefits" link="#" variant="Regular" />
        <InternalContentfulButton longText="Get help with myRAC" link="#" variant="Regular" />
        <InternalContentfulButton longText="Visit our online shop" link="#" variant="Regular" />
      </InternalButtonContainer>
    </Grid>
  );
};
