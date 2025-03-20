import type { ComponentProps } from "#types/horizons/componentProps";
import type { ContentfulLinkList, LinkListProps } from "#types/horizons/linkList";
import { Box } from "@mui/material";

import { getLinkList } from "./data";
import LinkListRendering from "./linkList";
import { styles } from "./styles";

const fetchLinkList = async (id: string) => {
  try {
    const data = await getLinkList(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function LinkList(props: ComponentProps) {
  const { data } = props;
  const linkListContentfulEntry: ContentfulLinkList = (await fetchLinkList(data.sys.id)) as ContentfulLinkList;

  if (!linkListContentfulEntry) {
    return <></>;
  }

  const linkList: LinkListProps = linkListContentfulEntry.data.horizons_linkList;

  const pages = linkList.pagesCollection?.items;

  if (!pages) {
    return <></>;
  }

  return (
    <Box component="section" sx={styles.linkListSection(linkList.sectionColour)}>
      <LinkListRendering linkList={linkList} pages={pages} />
    </Box>
  );
}

export default LinkList;
