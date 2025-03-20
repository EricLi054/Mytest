import type { ContentItem } from "#components/ComponentSwitcher/types";
import type { LandingPageSchema } from "#graphql/sharedSchema/pageSchema";
import type { z } from "zod";
import { redirect } from "next/navigation";
import AlertBannerList from "#components/AlertBannerList";
import Banner from "#components/Banner";
import ComponentSwitcher from "#components/ComponentSwitcher";
import Footer from "#components/Footer/index";
import Header from "#components/Header";
import { GTMPageView } from "#components/shared/GTMPageView";
import { getADB2CAccount } from "#graphql/adb2c";
import { getPerson } from "#graphql/person/queries";
import { errorPages } from "#utils/errorPages";
import { getCrmId } from "#utils/session/getCrmId";

const FIND_MY_PRODUCTS_URL = "/My-Products/Find-My-Products";
const NON_MEMBER_TYPE = "Non-Member";

export default async function LandingPage({
  slug,
  pageData,
}: Readonly<{ slug: string; pageData: z.infer<typeof LandingPageSchema> }>) {
  const sessionCrmId = await getCrmId();

  if (sessionCrmId) {
    const person = await getPerson();
    const newLocal = person.membershipType === NON_MEMBER_TYPE;
    if (!person.firstName) {
      return redirect(errorPages.somethingWentWrong);
    } else if (newLocal) {
      return redirect(errorPages.membershipLapsed);
    }
  } else {
    const adb2cAccount = await getADB2CAccount();
    if (adb2cAccount.crmId) {
      return redirect(`/signIn?callbackUrl=/${slug}&refresh=true`);
    } else {
      console.log(`No CRM ID or ADB2C account found for adb2cAccount: ${adb2cAccount.id || "NO ID"}`);
      return redirect(FIND_MY_PRODUCTS_URL);
    }
  }

  const { bannerAlerts, navigation, breadcrumbs, title, banner, footer } = pageData;

  return (
    <>
      <GTMPageView />
      {bannerAlerts && <AlertBannerList id={bannerAlerts.sys.id} />}
      <Header id={navigation.sys.id} breadcrumbs={breadcrumbs.items} title={title} />
      {banner && <Banner id={banner.sys.id} />}
      {pageData.content?.items?.map((item: ContentItem, index: number) => {
        return <ComponentSwitcher key={index} component={item} />;
      })}
      <Footer id={footer.sys.id} />
    </>
  );
}
