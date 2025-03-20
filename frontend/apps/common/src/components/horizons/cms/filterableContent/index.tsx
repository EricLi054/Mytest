import type { ContentfulArticleCollectionData } from "#types/horizons/article";
import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulFilterableContent, FilterableContentProps } from "#types/horizons/filterableContent";

import { getFilterableContent } from "./data";
import FilterableContentRendering from "./filterableContent";
import { getArticlesFromCategory } from "./getArticlesFromCategory";
import { getArticlesFromTags } from "./getArticlesFromTags";

const fetchFilterableContent = async (id: string) => {
  try {
    const data = await getFilterableContent(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchArticlesFromTags = async (tags: string[]) => {
  try {
    const data = await getArticlesFromTags(tags);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchArticlesFromCategory = async (category: string) => {
  try {
    const data = await getArticlesFromCategory(category);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function FilterableContent(props: ComponentProps) {
  const { data } = props;
  const filterableContentContentfulEntry: ContentfulFilterableContent = (await fetchFilterableContent(
    data.sys.id,
  )) as ContentfulFilterableContent;

  if (!filterableContentContentfulEntry) {
    return <></>;
  }

  const filterableContent: FilterableContentProps = filterableContentContentfulEntry.data.horizons_filterableContent;

  const { filterBy, contentfulMetadata, category } = filterableContent;

  const articlesData: ContentfulArticleCollectionData =
    filterBy === "Tags"
      ? ((await fetchArticlesFromTags(
          contentfulMetadata.tags?.map((tag) => tag.id) ?? [],
        )) as ContentfulArticleCollectionData)
      : ((await fetchArticlesFromCategory(category.name)) as ContentfulArticleCollectionData);

  if (!articlesData) {
    return <></>;
  }

  const articles = articlesData.data.horizons_articleCollection.items;

  return <FilterableContentRendering filterableContent={filterableContent} articles={articles} />;
}

export default FilterableContent;
