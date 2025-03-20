import type { Category } from "./category";
import type { YoutubeEmbedCollection } from "./youtubeEmbed";

export type ContentfulVideoCarousel = {
  data: {
    horizons_videoCarousel: VideoCarouselProps;
  };
} | null;

export type VideoCarouselProps = {
  title: string;
  slug: string;
  sectionColour: "White" | "Grey";
  category: Category;
  heading: string;
  seeMoreButtonText: string;
  seeMoreButtonUrl: string;
  videosCollection: YoutubeEmbedCollection | null;
};
