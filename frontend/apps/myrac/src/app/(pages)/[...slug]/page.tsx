import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSlugPageData } from "#graphql/pages/getSlugPageData";
import { getSlugPageMetaData } from "#graphql/pages/getSlugPageMetaData";
import { SlugPageMetaDataSchema, SlugPageSchema } from "#graphql/sharedSchema/pageSchema";

import LandingPage from "./(LandingPage)";
import StandardErrorPage from "./(StandardErrorPage)";

export const revalidate = 300;

// TODO: Bring over all the tests for this file and the other 2

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSlugPageMetaData(slug.join("/"), SlugPageMetaDataSchema);

  const metaData = data.landingPage?.metaData ?? data.standardErrorPage?.metaData;

  if (!metaData) {
    return {
      title: "myRAC",
    };
  }

  return {
    title: metaData.title,
    description: metaData.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const data = await getSlugPageData(slug.join("/"), SlugPageSchema);

  if (!data.landingPage && !data.standardErrorPage) {
    return notFound();
  }

  if (data.landingPage) {
    return <LandingPage slug={slug.join("/")} pageData={data.landingPage} />;
  } else if (data.standardErrorPage) {
    return <StandardErrorPage pageData={data.standardErrorPage} />;
  } else {
    return notFound();
  }
}
