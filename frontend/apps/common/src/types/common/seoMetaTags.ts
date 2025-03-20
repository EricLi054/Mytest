import type { CloudinaryAsset } from "@racwa/ui";

export type SeoMetaTags = {
  title: string | null;
  description: string | null;
  openGraphTitle: string | null;
  openGraphDescription: string | null;
  openGraphImage: CloudinaryAsset | null;
  openGraphSiteName: string | null;
  openGraphUrl: string | null;
  allowSearchEngineIndexing: boolean | null;
  allowSearchEngineFollowing: boolean | null;
};
