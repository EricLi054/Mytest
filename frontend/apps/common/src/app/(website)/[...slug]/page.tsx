import type { ContentfulBasePage } from "#types/common/basePage";
import type { SlugPageProps } from "#types/common/slugPageProps";
import Banner from "#components/common/banner";
import DropDown from "#components/common/categorySelect";

import NotFound from "../not-found";
import { getWebsitePage } from "./data";

const fetchWebsitePage = async (slug: string) => {
  try {
    const data = await getWebsitePage(slug);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default async function Page({ params }: { params: SlugPageProps }) {
  const { slug } = await params;
  const contentfulData: ContentfulBasePage = (await fetchWebsitePage(
    slug.join("/").toLowerCase(),
  )) as ContentfulBasePage;

  const pageData = contentfulData.data.rac_basePageCollection.items[0];

  if (!pageData) {
    return <NotFound />;
  }

  if (pageData.banner) {
    return (
      <>
        <Banner data={pageData.banner} />

        {pageData.slug == "contact-us" && <DropDown slug={pageData.slug} />}
      </>
    );
  } else {
    return <NotFound />;
  }
}
