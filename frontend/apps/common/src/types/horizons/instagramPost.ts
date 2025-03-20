export type ContentfulInstagramPost = {
  data: {
    horizons_instagramPostEmbed: InstagramPostEmbedProps;
  };
} | null;

export type InstagramPostEmbedProps = {
  title: string;
  postUrl: string;
};
