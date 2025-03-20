import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulCtaBanner, ctaBannerProps } from "#types/horizons/ctaBanner";

import CtaBannerRendering from "./ctaBannerRendering";
import { getCtaBanner } from "./data";

const fetchCtaBanner = async (id: string) => {
  try {
    const data = await getCtaBanner(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function CtaBanner(props: ComponentProps) {
  const { data } = props;
  const ctaBannerContentfulEntry: ContentfulCtaBanner = (await fetchCtaBanner(data.sys.id)) as ContentfulCtaBanner;

  if (!ctaBannerContentfulEntry) {
    return <></>;
  }

  const ctaBanner: ctaBannerProps = ctaBannerContentfulEntry.data.horizons_ctaBanner;

  return <CtaBannerRendering ctaBanner={ctaBanner} />;
}

export default CtaBanner;
