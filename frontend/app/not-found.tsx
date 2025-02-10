import ErrorPageContent from '@/components/ServerComponents/ErrorPageContent';
import Footer from '@/components/ServerComponents/Footer/Footer';
import TopNavBar from '@/components/ServerComponents/TopNavBar';
import { contentQuery } from '@/graphql/queries/contentQuery';
import { errorPageQuery } from '@/graphql/queries/errorPageQuery';
import getData from '@/graphql/getData';

export default async function Custom404() {
  const query = contentQuery(errorPageQuery('not-found'));

  const data = await getData(query);

  let pageData;
  if (data?.contentDataRequest) {
    const cmsData = JSON.parse(data.contentDataRequest[0]);
    pageData = cmsData?.data?.page?.items[0];
  }

  return (
    <>
      {pageData?.navigation && <TopNavBar data={pageData.navigation} title={pageData.title} />}
      <ErrorPageContent
        heading={pageData?.heading ?? '404'}
        title='Uh oh! We seem to be missing some parts'
        subtitle="Sorry, we can't find the page that you're looking for."
      />
      {pageData?.footer && <Footer data={pageData.footer} />}
    </>
  );
}
