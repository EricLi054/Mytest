import type { Meta } from "@storybook/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCertificate, faQuestion, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";
import { EnvironmentVariableProvider } from "#providers/environmentVariables";

import { InternalBanner } from "./InternalBanner";

library.add(faCertificate);
library.add(faShoppingCart);
library.add(faQuestion);

export default {
  title: "MyRAC/Components/Server Components/Banner",
  component: InternalBanner,
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
} satisfies Meta<typeof InternalBanner>;

export const MyRACBanner = () => {
  return (
    <InternalBanner
      bannerImages={[
        {
          secureUrl:
            "https://res.rac.com.au/dltdv24vg/image/upload/v1697522335/myRAC/RAC_Beach_IMGP2473_Lime-3096x1600_lwny0b.jpg",
        },
        {
          secureUrl:
            "https://res.rac.com.au/dltdv24vg/image/upload/v1733811111/myRAC/RAC_Red_Dirt_IMGP2885_Lime_R4-3096x2322_ew2oow_onehnm.jpg",
        },
        {
          secureUrl:
            "https://res.rac.com.au/dltdv24vg/image/upload/v1733811127/myRAC/TT_stargazing_outback_enlc6f_vi5gar.jpg",
        },
      ]}
      topTasks={[
        {
          longText: "Get a quote",
          shortText: "Quote",
          link: "#",
          icon: "certificate",
        },
        {
          longText: "myRAC Help",
          shortText: "Help",
          link: "#",
          icon: "question",
        },
        {
          longText: "Online shop",
          shortText: "Shop",
          link: "#",
          icon: "shopping-cart",
        },
      ]}
      bannerText={
        <>
          <Typography variant="h1" color="inherit">
            Heading 1
          </Typography>
          <Typography variant="h2" color="inherit">
            Heading 2
          </Typography>
        </>
      }
    />
  );
};
