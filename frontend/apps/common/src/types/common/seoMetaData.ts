export type SeoMetaData = {
  title: string;
  description: string;
  keywords: string;
  image: SeoMetaDataImage | null;
};

export type SeoMetaDataImage = {
  filename: string;
  description: string;
  size: number;
  url: string;
  title: string;
  width: number;
  height: number;
};
