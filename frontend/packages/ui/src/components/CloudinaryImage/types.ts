export type ContentfulCloudinaryAsset = {
  data: {
    horizons_cloudinaryAsset: CloudinaryAsset;
  };
} | null;

export type CloudinaryAsset = {
  title: string;
  image: CloudinaryImage[] | [];
  image_data: [
    {
      context: {
        custom: {
          alt: string;
          caption: string;
        } | null;
      } | null;
    },
  ] | null;
  showCaption: boolean;
  link: string;
  openLinkInNewTab: boolean;
  fillContainerWidth: boolean;
};

export type CloudinaryImage = {
  url: string;
  tags: string[];
  type: string;
  bytes: number;
  width: number;
  format: string;
  height: number;
  context: {
    custom: {
      alt: string;
      caption: string;
    } | null;
  } | null;
  version: number;
  duration: number;
  metadata: Record<string, string>;
  public_id: string;
  created_at: string;
  secure_url: string;
  original_url: string;
  resource_type: string;
};
