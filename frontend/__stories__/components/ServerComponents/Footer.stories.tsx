import { footerLinks, footerSocialLinks, sitemapData } from '@/__tests__/mockData/footer';
import InternalFooter from '@/components/ServerComponents/Footer/InternalFooter';
import { Typography } from '@mui/material';

export default {
  title: 'Components/Server Components/Footer',
  component: InternalFooter,
  tags: ['autodocs']
};

export const WebsiteFooter = () => {
  return (
    <InternalFooter
      logo='https://res.rac.com.au/image/upload/f_auto/q_auto/v1710747357/myRAC/RAC-footer-logo_sjd9mx.png'
      searchPlaceholderText="Can't find what you're looking for?"
      sitemapData={sitemapData}
      links={footerLinks}
      socialLinks={footerSocialLinks}
      footerDescription={
        <Typography variant='body1'>832 Wellington Street, West Perth, Western Australia, 6005</Typography>
      }
    />
  );
};
