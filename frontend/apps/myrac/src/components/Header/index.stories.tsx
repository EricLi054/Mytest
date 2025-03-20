import type { Meta } from "@storybook/react";
import type { Session } from "next-auth";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Link, Typography } from "@mui/material";
import { EnvironmentVariableProvider } from "#providers/environmentVariables";
import { SessionProvider } from "next-auth/react";

import InternalHeader from "./InternalHeader";
import { testHeaderSchema, testPerson } from "./testData";

library.add(fas);

const tenMinutesInms = 600000;
const mockSession: Session = {
  user: { name: "Test User" },
  expires: (Date.now() + tenMinutesInms).toString(),
};

const meta: Meta<typeof InternalHeader> = {
  title: "MyRAC/Components/Client Components/Responsive Header",
  component: InternalHeader,
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
} satisfies Meta<typeof InternalHeader>;
export default meta;

export const Default = () => {
  return (
    <SessionProvider session={mockSession}>
      <InternalHeader headerData={testHeaderSchema} person={testPerson} />
    </SessionProvider>
  );
};

export const WithBreadcrumbs = () => {
  return (
    <SessionProvider session={mockSession}>
      <InternalHeader
        headerData={testHeaderSchema}
        person={testPerson}
        breadcrumbs={[
          <Typography key="/myrac">
            <Link href="#">myRAC</Link>
          </Typography>,
          <Typography key="/page">Page Name</Typography>,
        ]}
      />
    </SessionProvider>
  );
};

export const LoggedOutState = () => {
  return (
    <SessionProvider session={null}>
      <InternalHeader headerData={testHeaderSchema} person={undefined} />
    </SessionProvider>
  );
};
