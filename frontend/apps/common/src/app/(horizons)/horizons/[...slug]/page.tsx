import type { SlugPageProps } from "#types/common/slugPageProps";
import type { Article, ContentfulArticleData } from "#types/horizons/article";
import type { ComponentItem } from "#types/horizons/componentItem";
import type { Page } from "#types/horizons/page";
import type { ContentfulSharedCollectionData } from "#types/horizons/sharedCollections";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getArticle } from "#components/horizons/cms/article/data";
import ComponentSwitcher from "#components/horizons/componentSwitcher";
import ContentfulRichTextRenderer from "#components/horizons/rendering/contentfulRichTextRenderer";
import HorizonsArticle from "#components/horizons/rendering/horizonsArticle";
import NotFound from "#components/horizons/rendering/notFound";
import ServerError from "#components/horizons/rendering/serverError";
import { getPlainTextFromRichText } from "#utils/common/getPlainTextFromRichText";
import { truncate } from "#utils/common/truncate";

import { getPageData } from "./data";

const fetchPageData = async (slug: string) => {
  try {
    const data = await getPageData(slug);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export async function generateMetadata({ params }: { params: SlugPageProps }): Promise<Metadata> {
  const { slug } = await params;
  const contentfulData: ContentfulSharedCollectionData = (await fetchPageData(
    slug.join("/"),
  )) as ContentfulSharedCollectionData;

  if (!contentfulData) {
    return {};
  }

  const articleItem = contentfulData.data.horizons_articleCollection.items[0];
  const pageItem = contentfulData.data.horizons_pageCollection.items[0];

  if (!articleItem && !pageItem) {
    return {};
  }

  if (articleItem) {
    const article: Article = articleItem;

    return {
      title: article.seoMetaTags?.title,
      description: article.seoMetaTags?.description,
      authors: {
        name: "RACWA",
      },
      openGraph: {
        title: article.seoMetaTags?.openGraphTitle ?? article.seoMetaTags?.title ?? "",
        description: article.seoMetaTags?.openGraphDescription ?? article.seoMetaTags?.description ?? "",
        url: article.seoMetaTags?.openGraphUrl ?? `https://rac.com.au/horizons/${article.slug}`,
        images: [
          {
            url: article.seoMetaTags?.openGraphImage?.image[0]?.secure_url ?? "",
            width: 800,
            height: 600,
            alt:
              article.seoMetaTags?.openGraphImage?.image_data?.[0]?.context?.custom?.alt ??
              article.seoMetaTags?.openGraphImage?.image[0]?.context?.custom?.alt ??
              "",
          },
        ],
        siteName: article.seoMetaTags?.openGraphSiteName ?? "RACWA",
      },
      robots: {
        index: article.seoMetaTags?.allowSearchEngineIndexing === true,
        follow: article.seoMetaTags?.allowSearchEngineFollowing === true,
      },
      other: {
        canonical: `https://rac.com.au/horizons/${article.slug}`,
      },
    };
  } else if (pageItem) {
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
  } else {
    return {};
  }
}

const jsonLd = (article: Article) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/horizons/${article.slug}`,
    },
    headline: `${article.title}`,
    description: `${article.leadParagraph !== "" ? article.leadParagraph : article.seoMetaTags?.description}`,
    image: `${article.tileImage?.image[0]?.secure_url ?? ""}`,
    author: {
      "@type": "Person",
      name: `${article.author?.name}`,
      url: `/horizons/authors/${article.author?.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "RACWA",
      logo: {
        "@type": "ImageObject",
        url: "https://res.rac.com.au/rac-horizons/image/upload/v1740035397/rac_logo_jvczlw.png",
      },
    },
    datePublished: `${article.published ?? article.sys.firstPublishedAt}`,
    dateModified: `${article.lastUpdated ?? article.sys.publishedAt}`,
    articleBody: `${truncate(getPlainTextFromRichText(article.content.json), 255)}`,
  };
};

export default async function HorizonsPage({ params }: { params: SlugPageProps }) {
  const { slug } = await params;
  const contentfulData: ContentfulSharedCollectionData = (await fetchPageData(
    slug.join("/"),
  )) as ContentfulSharedCollectionData;

  if (!contentfulData) {
    return <ServerError />;
  }

  const articleItem = contentfulData.data.horizons_articleCollection.items[0];
  const pageItem = contentfulData.data.horizons_pageCollection.items[0];

  if (articleItem) {
    const article: Article = articleItem;

    if (article.redirectUrl && article.redirectUrl !== "") {
      permanentRedirect(article.redirectUrl);
    }

    const relatedArticles = article.relatedArticlesCollection.items;
    const relatedArticleItems: Article[] = [];

    if (relatedArticles.length > 0) {
      for (const item of relatedArticles) {
        const articleData: ContentfulArticleData = (await getArticle(item.sys.id)) as ContentfulArticleData;

        if (!articleData) {
          continue;
        }

        relatedArticleItems.push(articleData.data.horizons_article);
      }
    }

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(article)) }} />
        <HorizonsArticle
          article={article}
          relatedArticles={relatedArticleItems}
          articleContent={
            <ContentfulRichTextRenderer
              text={article.content}
              isArticlePage={true}
              category={article.category}
              relatedArticleVariant="advanced"
            />
          }
          articleContentPlainText={getPlainTextFromRichText(article.content.json)}
        />
      </>
    );
  } else if (pageItem) {
    const page: Page = pageItem;
    const contentItems = page.contentCollection?.items;
    return (
      <>
        {contentItems?.map((item: ComponentItem, index: number) => {
          return <ComponentSwitcher key={index} component={item} />;
        })}
      </>
    );
  } else {
    return <NotFound />;
  }
}
