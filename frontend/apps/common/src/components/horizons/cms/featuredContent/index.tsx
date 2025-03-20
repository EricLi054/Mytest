import type { Article } from "#types/horizons/article";
import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulFeaturedContent, FeaturedContentProps } from "#types/horizons/featuredContent";
import type { ContentfulYoutubeEmbed } from "#types/horizons/youtubeEmbed";
import { Box } from "@mui/material";

import ArticleCarousel from "../../layout/articleCarousel";
import ArticleGrid from "../../layout/articleGrid";
import ArticleGridWithList from "../../layout/articleGridWithList";
import ArticleGridWithSeeMoreButton from "../../layout/articleGridWithSeeMoreButton";
import { getYoutubeEmbed } from "../youtubeEmbed/data";
import { getFeaturedContent } from "./data";
import { styles } from "./styles";

const fetchFeaturedContent = async (id: string) => {
  try {
    const data = await getFeaturedContent(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function FeaturedContent(props: ComponentProps) {
  const { data } = props;
  const featuredContentContentfulEntry: ContentfulFeaturedContent = (await fetchFeaturedContent(
    data.sys.id,
  )) as ContentfulFeaturedContent;

  if (!featuredContentContentfulEntry) {
    return <></>;
  }

  const featuredContent: FeaturedContentProps = featuredContentContentfulEntry.data.horizons_featuredContent;

  const articles: Article[] = await Promise.all(
    featuredContent.articlesCollection?.items.map(async (article) => {
      const youtubeEmbed = article.content.links?.entries.block.find(
        (content) => content.__typename === "horizons_YoutubeEmbed",
      );

      if (!youtubeEmbed) {
        return article;
      }

      const youtubeEmbedData: ContentfulYoutubeEmbed = (await getYoutubeEmbed(
        youtubeEmbed.sys.id,
      )) as ContentfulYoutubeEmbed;

      if (!youtubeEmbedData) {
        return article;
      }

      return {
        ...article,
        richMedia: youtubeEmbedData.data.horizons_youtubeEmbed,
      };
    }) ?? [],
  );

  return (
    <Box component="section" sx={styles.featuredContentSection(featuredContent.sectionColour)}>
      {featuredContent.rendering === "Carousel" && (
        <ArticleCarousel
          category={featuredContent.category}
          heading={featuredContent.heading}
          articles={articles}
          cardType={featuredContent.cardType}
          showCategoryOnCard={featuredContent.showCategoryOnCard}
          showViewAllButton={featuredContent.showViewAllButton}
          viewAllButtonLink={featuredContent.viewAllButtonLink}
          sectionColour={featuredContent.sectionColour}
        />
      )}
      {featuredContent.rendering === "Grid" && (
        <ArticleGrid
          category={featuredContent.category}
          heading={featuredContent.heading}
          articles={articles}
          cardType={featuredContent.cardType}
          showCategoryOnCard={featuredContent.showCategoryOnCard}
          sectionColour={featuredContent.sectionColour}
        />
      )}
      {featuredContent.rendering === "Grid with list" && (
        <ArticleGridWithList
          category={featuredContent.category}
          heading={featuredContent.heading}
          articles={articles}
          cardType={featuredContent.cardType}
          seeMoreButtonText={featuredContent.seeMoreButtonText}
          seeMoreButtonUrl={featuredContent.seeMoreButtonUrl}
          showCategoryOnCard={featuredContent.showCategoryOnCard}
          sectionColour={featuredContent.sectionColour}
        />
      )}
      {featuredContent.rendering === "Grid with See More Button" && (
        <ArticleGridWithSeeMoreButton
          category={featuredContent.category}
          heading={featuredContent.heading}
          articles={articles}
          cardType={featuredContent.cardType}
          seeMoreButtonText={featuredContent.seeMoreButtonText}
          seeMoreButtonUrl={featuredContent.seeMoreButtonUrl}
          showCategoryOnCard={featuredContent.showCategoryOnCard}
          sectionColour={featuredContent.sectionColour}
        />
      )}
    </Box>
  );
}

export default FeaturedContent;
