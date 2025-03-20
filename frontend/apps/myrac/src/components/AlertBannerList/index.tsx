import type { ComponentSwitchableProps } from "#components/ComponentSwitcher/types";

import AlertBanner from "./AlertBanner";
import { getBannerAlertsData } from "./data";

const AlertBannerList = async ({ id }: ComponentSwitchableProps) => {
  const data = await getBannerAlertsData(id);
  if (!data || data.items.length === 0) {
    return undefined;
  }

  return data.items.map((item) => {
    return <AlertBanner key={item.title} bannerAlert={item} />;
  });
};

export default AlertBannerList;
