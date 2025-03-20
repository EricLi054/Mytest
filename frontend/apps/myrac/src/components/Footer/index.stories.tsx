import { library } from "@fortawesome/fontawesome-svg-core";
import { faFacebookSquare, faInstagram, faLinkedinIn, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Typography } from "@mui/material";

import InternalFooter from "./InternalFooter";
import { footerLinks, footerSocialLinks, sitemapData } from "./testData";

library.add(faInstagram);
library.add(faFacebookSquare);
library.add(faTwitter);
library.add(faLinkedinIn);

export default {
  title: "MyRAC/Components/Server Components/Footer",
  component: InternalFooter,
  tags: ["@racwa/myrac"],
};

export const WebsiteFooter = () => {
  return (
    <InternalFooter
      logo="https://res.rac.com.au/image/upload/f_auto/q_auto/v1710747357/myRAC/RAC-footer-logo_sjd9mx.png"
      searchPlaceholderText="Can't find what you're looking for?"
      sitemapData={sitemapData}
      links={footerLinks}
      socialLinks={footerSocialLinks}
      footerDescription={
        <Typography variant="body1">832 Wellington Street, West Perth, Western Australia, 6005</Typography>
      }
    />
  );
};
