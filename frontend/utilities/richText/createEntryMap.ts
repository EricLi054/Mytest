import { type Links } from '@/types/cmsTypes/RichTextProps';

const createEntryMap = (links: Links | undefined) => {
  const entryMap = new Map();
  if (links?.entries !== undefined) {
    // loop through the inline linked entries and add them to the map
    for (const entry of links.entries.inline) {
      entryMap.set(entry?.sys?.id ?? '', entry);
    }
  }
  return entryMap;
};

export default createEntryMap;
