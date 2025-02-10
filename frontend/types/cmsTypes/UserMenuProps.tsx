import { type LinkProps } from './LinkProps';

export interface UserMenuProps {
  userMenuText: { sys: { id: string } };
  userFullName: { sys: { id: string } };
  menuItems: {
    items: LinkProps[];
  };
}
