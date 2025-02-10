import InternalBanner from '@/components/ServerComponents/Banner/InternalBanner';
import { Typography } from '@mui/material';

export default {
  title: 'Components/Server Components/Banner',
  component: InternalBanner,
  tags: ['autodocs']
};

export const MyRACBanner = () => {
  return (
    <InternalBanner
      bannerImage='https://res.cloudinary.com/dltdv24vg/image/upload/f_auto/q_auto/v1697522335/myRAC/RAC_Beach_IMGP2473_Lime-3096x1600_lwny0b.jpg'
      bannerText={
        <>
          <Typography variant='h1' color='inherit'>
            Heading 1
          </Typography>
          <Typography variant='h2' color='inherit'>
            Heading 2
          </Typography>
        </>
      }
      topTasks={[
        {
          longText: 'Get a quote',
          shortText: 'Quote',
          icon: 'certificate',
          link: '#',
          variant: 'Icon CTA'
        },
        {
          longText: 'Online Shop',
          shortText: 'Online Shop',
          icon: 'shopping-cart',
          link: '#',
          variant: 'Icon CTA'
        }
      ]}
    />
  );
};
