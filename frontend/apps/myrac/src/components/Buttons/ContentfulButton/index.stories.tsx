import type { Meta } from "@storybook/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCertificate, faChevronRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { Grid2 as Grid } from "@mui/material";
import { EnvironmentVariableProvider } from "#providers/environmentVariables";

import { colors } from "@racwa/styles";

import InternalContentfulButton from "./InternalContentfulButton";

library.add(faCertificate);
library.add(faUser);
library.add(faChevronRight);

export default {
  title: "MyRAC/Components/Server Components/Contentful Button",
  component: InternalContentfulButton,
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
} satisfies Meta<typeof InternalContentfulButton>;

export const ProfileButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton
        longText="Contact details"
        shortText="Including login details"
        link="#"
        icon="user"
        variant="Profile Link"
      />
    </Grid>
  );
};

export const CTATransparentButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton
        longText="Profile"
        link="#"
        colour="secondary"
        border={true}
        icon="user"
        variant="CTA Transparent"
      />
    </Grid>
  );
};

export const RegularButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton longText="Update your details" link="#" variant="Regular" />
    </Grid>
  );
};

export const ImageButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton
        longText="Health Insurance"
        image={[
          {
            secureUrl:
              "https://res.cloudinary.com/dltdv24vg/image/upload/f_auto/q_auto/v1696820471/myRAC/health-insurance_d9nk3j.svg",
          },
        ]}
        link="#"
        variant="Image"
      />
    </Grid>
  );
};

export const IconCTAButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton
        longText="Get a quote"
        shortText="Quote"
        icon="certificate"
        colour="primary"
        link="#"
        variant="Icon CTA"
      />
    </Grid>
  );
};
