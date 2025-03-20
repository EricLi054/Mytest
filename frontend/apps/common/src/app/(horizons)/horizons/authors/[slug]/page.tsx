import type { SingleSlugPageProps } from "#types/common/slugPageProps";
import type { Author, ContentfulAuthorCollectionData } from "#types/horizons/author";
import type { Metadata } from "next";
import ContentfulRichTextRenderer from "#components/common/contentfulRichTextRenderer";
import AuthorCard from "#components/horizons/rendering/authorCard";
import AuthorLatestArticles from "#components/horizons/rendering/authorLatestArticles";
import NotFound from "#components/horizons/rendering/notFound";
import ServerError from "#components/horizons/rendering/serverError";

import { getAuthorData } from "./data";

const fetchAuthorData = async (slug: string) => {
  try {
    const data = await getAuthorData(slug);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export async function generateMetadata({ params }: { params: SingleSlugPageProps }): Promise<Metadata> {
  const { slug } = await params;
  const contentfulData: ContentfulAuthorCollectionData = (await fetchAuthorData(
    slug,
  )) as ContentfulAuthorCollectionData;

  if (!contentfulData) {
    return {};
  }

  const authorItem = contentfulData.data.horizons_authorCollection.items[0];

  if (!authorItem) {
    return {};
  }

  const author: Author = authorItem;

  const title = author.name;
  const description = author.name;
  const authorName = author.name;
  const openGraphTitle = author.name !== "" ? author.name : title;
  const openGraphDescription = author.name !== "" ? author.name : description;
  const openGraphSiteName = "RACWA";
  const openGraphUrl = `https://rac.com.au/horizons/authors/${author.slug}`;
  const openGraphImage = author.profilePicture[0]?.secure_url;
  const allowSearchEngineIndexing = true;
  const allowSearchEngineFollowing = true;

  return {
    title,
    description,
    authors: {
      name: authorName,
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: openGraphUrl,
      images: [
        {
          url: openGraphImage ?? "",
          width: 800,
          height: 600,
          alt: author.name,
        },
      ],
      siteName: openGraphSiteName,
    },
    robots: {
      index: allowSearchEngineIndexing,
      follow: allowSearchEngineFollowing,
    },
    other: {
      canonical: `https://rac.com.au/horizons/authors/${author.slug}`,
    },
  };
}

export default async function AuthorPage({ params }: { params: SingleSlugPageProps }) {
  const { slug } = await params;

  const contentfulData: ContentfulAuthorCollectionData = (await fetchAuthorData(
    slug,
  )) as ContentfulAuthorCollectionData;

  if (!contentfulData) {
    return <ServerError />;
  }

  const authorContentItem = contentfulData.data.horizons_authorCollection.items[0];

  if (!authorContentItem) {
    return <NotFound />;
  }

  const authorContent: Author = authorContentItem;
  const authorArticles = contentfulData.data.horizons_articleCollection?.items;

  return (
    <>
      <AuthorCard
        author={authorContent}
        authorBio={<ContentfulRichTextRenderer text={authorContent.bio} typographyVariant="body1" />}
      />
      <AuthorLatestArticles articles={authorArticles ?? []} />
    </>
  );
}
