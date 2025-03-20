import type { ContentfulCategoryCollectionData } from "#types/horizons/category";
import { getCategories } from "#components/horizons/cms/category/data";

import Navbar from "./navbar";

const fetchCategories = async () => {
  try {
    const data = await getCategories();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function Masthead() {
  const contentfulData: ContentfulCategoryCollectionData =
    (await fetchCategories()) as ContentfulCategoryCollectionData;

  if (!contentfulData) {
    return <></>;
  }

  const categoryContentItems = contentfulData.data.horizons_categoryCollection.items;

  if (!categoryContentItems.length || categoryContentItems.length === 0) {
    return <></>;
  }

  return <Navbar categories={categoryContentItems} />;
}

export default Masthead;
