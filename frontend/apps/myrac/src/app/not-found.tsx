import NotFoundPageContent from "#components/Error/NotFoundPageContent";
import Footer from "#components/Footer";
import Header from "#components/Header";
import { getNotFoundPageData } from "#graphql/pages/getNotFoundPageData";

// TODO: Bring this page content into code
// Shall we just have the header and footer ID's as constants to reference here?
// That could also help with putting those components into the layout file rather than them being build with the page
export default async function NotFound() {
  const { title, navigation, footer } = await getNotFoundPageData();
  return (
    <>
      <Header id={navigation.sys.id} title={title} />
      <NotFoundPageContent />
      <Footer id={footer.sys.id} />
    </>
  );
}
