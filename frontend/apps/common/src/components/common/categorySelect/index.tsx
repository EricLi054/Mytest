import type { ContentfulDropDownCollection } from "#types/common/categorySelect";

import { getDropDownCollection } from "./data";
import WebsiteDropDown from "./dropDown";

type DropDownProps = {
  slug: string;
};

const fetchDropDownCollection = async (slug: string) => {
  try {
    const data = await getDropDownCollection(slug);
    return data;
  } catch (error) {
    console.log(error);
  }
};

async function DropDown(props: DropDownProps) {
  const { slug } = props;
  const dropDownContentfulEntry: ContentfulDropDownCollection = (await fetchDropDownCollection(
    slug,
  )) as ContentfulDropDownCollection;

  const dropDownCategoryList = dropDownContentfulEntry.data.rac_basePageCollection.items[0]?.contentCollection.items;

  if (!dropDownCategoryList) {
    return null;
  }

  if (!dropDownCategoryList.length) {
    return null;
  }

  return <WebsiteDropDown items={dropDownCategoryList} />;
}

export default DropDown;
