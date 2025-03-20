import type { ContentfulSharedCollectionData } from "#types/horizons/sharedCollections";
import type { MetadataRoute } from "next";
import { clientEnv } from "#env/client";

import { getSitemapData } from "./sitemap.data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const fetchSitemapData = async () => {
  try {
    const data = await getSitemapData();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contentfulData: ContentfulSharedCollectionData = (await fetchSitemapData()) as ContentfulSharedCollectionData;

  if (!contentfulData) {
    return [];
  }

  const baseDomain = clientEnv().NEXT_PUBLIC_RAC_HOMEPAGE;

  const pages = contentfulData.data.horizons_pageCollection.items;

  const dynamicPages: MetadataRoute.Sitemap = pages.map(({ slug, sys }) => ({
    url: slug !== "/" ? `${baseDomain}/horizons/${slug}` : `${baseDomain}/horizons`,
    lastModified: sys.publishedAt ?? new Date(),
  }));

  const articles = contentfulData.data.horizons_articleCollection.items;

  const dynamicArticles: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseDomain}/horizons/${article.slug}`,
    lastModified: article.published ?? article.sys.publishedAt ?? new Date(),
  }));

  return [...dynamicPages, ...dynamicArticles];
}
