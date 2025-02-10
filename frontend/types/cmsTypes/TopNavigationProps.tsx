import { type CloudinaryImage } from './CloudinaryImage';
import { type LinkProps } from './LinkProps';
import { type UserMenuProps } from './UserMenuProps';

export interface MegaNavSection {
  title: string;
  subtitle: string;
  moreInfoLink: string;
  links: {
    items: LinkProps[];
  };
  articles: {
    items: LinkProps[];
  };
}

export interface TopNavigationProps {
  showBreadcrumbs: boolean;
  links: { items: LinkProps[] };
  mobileLinks: { items: LinkProps[] };
  searchBar: {
    placeholderText: string;
  };
  userMenu: UserMenuProps;
  megaNavContent?: {
    logo: CloudinaryImage[];
    sections: { items: MegaNavSection[] };
  };
}
