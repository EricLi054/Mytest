import type { Article, ContentfulArticleData } from "#types/horizons/article";
import type { ComponentProps } from "#types/horizons/componentProps";

import ContentRelatedArticleRendering from "../../rendering/contentRelatedArticle";
import SimpleArticleListItemRendering from "../../rendering/simpleArticleListItem";
import { getArticle } from "../article/data";

export type CustomComponentProps = {
  relatedArticleRendering?: "simple" | "advanced";
} & ComponentProps;

const fetchArticle = async (id: string) => {
  try {
    const data = await getArticle(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function ContentRelatedArticle({ relatedArticleRendering, ...props }: CustomComponentProps) {
  const { data } = props;
  const articleContentfulEntry: ContentfulArticleData = (await fetchArticle(data.sys.id)) as ContentfulArticleData;

  if (!articleContentfulEntry) {
    return <></>;
  }

  const article: Article = articleContentfulEntry.data.horizons_article;

  return relatedArticleRendering === "simple" ? (
    <SimpleArticleListItemRendering article={article} showCategoryOnCard={false} />
  ) : (
    <ContentRelatedArticleRendering article={article} showRelatedHeading={true} showCategoryOnCard={true} />
  );
}

export default ContentRelatedArticle;
