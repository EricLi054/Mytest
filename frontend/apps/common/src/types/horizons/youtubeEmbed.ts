import type { CloudinaryAsset } from "@racwa/ui";

export type ContentfulYoutubeEmbedCollectionData = {
  data: {
    horizons_youtubeEmbedCollection: YoutubeEmbedCollection;
  };
} | null;

export type ContentfulYoutubeEmbed = {
  data: {
    horizons_youtubeEmbed: YoutubeEmbedProps;
  };
} | null;

export type YoutubeEmbedCollection = {
  items: YoutubeEmbedProps[];
};

export type YoutubeEmbedProps = {
  title: string;
  url: string;
  mediaType: "" | "Video" | "Podcast";
  durationValue: number;
  durationUnit: "Minutes" | "Hours";
  videoImageThumbnail: CloudinaryAsset | null;
};
