import type { ComponentSwitchableProps } from "#components/ComponentSwitcher/types";
import { GALink } from "#components/Links/GALink";

import { getContentfulGALinkData } from "./data";

const ContentfulGALink = async ({ id }: ComponentSwitchableProps) => {
  try {
    const resultData = await getContentfulGALinkData(id);

    return (
      <GALink
        longLinkText={resultData.longLinkText}
        href={resultData.linkUrl ?? ""}
        googleAnalyticsDescription={resultData.googleAnalyticsDescription}
      />
    );
  } catch (error) {
    console.error("Error: ContentfulGALink.tsx -", error);
  }
};

export default ContentfulGALink;
