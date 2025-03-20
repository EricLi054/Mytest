import type { ContentfulBanner } from "#types/common/banner";
import type { ComponentSwitcherProps } from "#types/common/componentSwitcherProps";

import ContentfulRichTextRenderer from "../contentfulRichTextRenderer";
import WebsiteBanner from "./banner";
import { getBanner } from "./data";

const fetchBanner = async (id: string) => {
  try {
    const data = await getBanner(id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

async function Banner({ data }: ComponentSwitcherProps) {
  const banner: ContentfulBanner = (await fetchBanner(data.sys.id)) as ContentfulBanner;

  return (
    <WebsiteBanner
      bannerImage={banner.data.rac_banner.bannerImage[0]?.secure_url ?? ""}
      bannerText={<ContentfulRichTextRenderer text={banner.data.rac_banner.heading} />}
    />
  );
}

export default Banner;
