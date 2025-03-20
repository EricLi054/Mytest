import type { Category } from "./category";
import type { PageCollection } from "./page";

export type ContentfulLinkList = {
  data: {
    horizons_linkList: LinkListProps;
  };
} | null;

export type LinkListProps = {
  title: string;
  slug: string;
  sectionColour: "White" | "Grey";
  category: Category;
  heading: string;
  pagesCollection: PageCollection | null;
};
