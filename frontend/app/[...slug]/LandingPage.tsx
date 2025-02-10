import TopNavBar from '@/components/ServerComponents/TopNavBar';
import Footer from '@/components/ServerComponents/Footer/Footer';
import Banner from '@/components/ServerComponents/Banner/Banner';
import ComponentSwitcher from '@/components/ServerComponents/ComponentSwitcher';
import { RacwaLoadingModal } from '@racwa/react-components';
import AlertBannerList from '@/components/ServerComponents/AlertBannerList';
import VWO from '@/components/ClientComponents/VWO';
import { MFAModalProvider } from '@/components/ClientComponents/MFA/MFAModalProvider';

export default async function LandingPage({ pageData }: Readonly<{ pageData: any | undefined }>) {
  if (!pageData) return <RacwaLoadingModal open={true} />;

  return (
    <>
      {pageData.bannerAlerts && <AlertBannerList data={pageData.bannerAlerts} />}
      {pageData.navigation && (
        <TopNavBar data={pageData.navigation} breadcrumbs={pageData.breadcrumbs?.items} title={pageData.title} />
      )}
      {pageData.banner && <Banner data={pageData.banner} />}
      <MFAModalProvider>
        {pageData.content?.items &&
          pageData.content.items.map((item: any, index: number) => {
            return <ComponentSwitcher key={index} component={item} />;
          })}
      </MFAModalProvider>
      {pageData.footer && <Footer data={pageData.footer} />}
      {pageData.enableVwo && <VWO accountId={`${process.env.VWO_ACCOUNT_ID ?? ''}`} />}
    </>
  );
}
