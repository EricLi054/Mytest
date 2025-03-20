import type { ComponentItem } from "#types/horizons/componentItem";
import type { ContentfulPageCollectionData, Page } from "#types/horizons/page";
import type { Metadata } from "next";
import ComponentSwitcher from "#components/horizons/componentSwitcher";
import NotFound from "#components/horizons/rendering/notFound";
import ServerError from "#components/horizons/rendering/serverError";

import { getHomePageData } from "./data";

const fetchHomePageData = async () => {
  try {
    const data = await getHomePageData();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const contentfulData: ContentfulPageCollectionData = (await fetchHomePageData()) as ContentfulPageCollectionData;

  if (!contentfulData) {
    return {};
  }

  const pageItem = contentfulData.data.horizons_pageCollection.items[0];

  if (!pageItem) {
    return {};
  }

  const page: Page = pageItem;

  return {
    title: page.seoMetaTags?.title,
    description: page.seoMetaTags?.description,
    authors: {
      name: "RACWA",
    },
    openGraph: {
      title: page.seoMetaTags?.openGraphTitle ?? page.seoMetaTags?.title ?? "",
      description: page.seoMetaTags?.openGraphDescription ?? page.seoMetaTags?.description ?? "",
      url: page.seoMetaTags?.openGraphUrl ?? `https://rac.com.au/horizons/${page.slug}`,
      images: [
        {
          url: page.seoMetaTags?.openGraphImage?.image[0]?.secure_url ?? "",
          width: 800,
          height: 600,
          alt:
            page.seoMetaTags?.openGraphImage?.image_data?.[0]?.context?.custom?.alt ??
            page.seoMetaTags?.openGraphImage?.image[0]?.context?.custom?.alt ??
            "",
        },
      ],
      siteName: page.seoMetaTags?.openGraphSiteName ?? "RACWA",
    },
    robots: {
      index: page.seoMetaTags?.allowSearchEngineIndexing === true,
      follow: page.seoMetaTags?.allowSearchEngineFollowing === true,
    },
    other: {
      canonical: `https://rac.com.au/horizons/${page.slug}`,
    },
  };
}

export default async function HorizonsHomePage() {
  const contentfulData: ContentfulPageCollectionData = (await fetchHomePageData()) as ContentfulPageCollectionData;

  if (!contentfulData) {
    return <ServerError />;
  }

  const homePageContentItem = contentfulData.data.horizons_pageCollection.items[0];

  if (!homePageContentItem) {
    return <NotFound />;
  }

  const homePageContent: Page = homePageContentItem;

  const homePageContentItems = homePageContent.contentCollection?.items;
  return (
    <>
      {homePageContentItems?.map((item: ComponentItem, index: number) => {
        return <ComponentSwitcher key={index} component={item} />;
      })}
    </>
  );
}
