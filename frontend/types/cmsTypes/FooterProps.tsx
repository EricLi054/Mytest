import { type ButtonProps } from './ButtonProps'
import { type CloudinaryImage } from './CloudinaryImage'
import { type LinkProps } from './LinkProps'
import { type RichTextProps } from './RichTextProps'

export interface FooterSearchBarProps {
  placeholderText: string
}

export interface FooterSitemapProps {
  parentLink: LinkProps
  links: { items: LinkProps[] }
}

export interface FooterProps {
  searchBar: FooterSearchBarProps
  endText: RichTextProps
  sitemap: { items: FooterSitemapProps[] }
  logo: CloudinaryImage[]
  links: { items: LinkProps[] }
  socialLinks: { items: ButtonProps[] }
}
