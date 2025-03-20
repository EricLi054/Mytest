export type ContentfulDropDownCollection = {
  data: {
    rac_basePageCollection: BasePageCollection;
  };
};

export type BasePageCollection = {
  items: CategorySelectContentCollection[];
};

export type CategorySelectContentCollection = {
  slug: string;
  contentCollection: MenuItemsCollection;
};

export type MenuItemsCollection = {
  items: DropDownItem[];
};

export type DropDownItem = {
  sys: {
    id: string;
  };
  categoryName: string;
};
