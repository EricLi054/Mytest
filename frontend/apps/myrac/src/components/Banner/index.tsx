import ContentfulRichTextRenderer from "#components/RichText/ContentfulRichTextRenderer";

import { getBannerData } from "./data";
import { InternalBanner } from "./InternalBanner";

export default async function Banner({ id }: { id: string }) {
  const banner = await getBannerData(id);

  return (
    <InternalBanner
      bannerImages={banner.bannerImage}
      topTasks={banner.bannerLinksCollection.items}
      bannerText={<ContentfulRichTextRenderer text={banner.heading} />}
    />
  );
}
