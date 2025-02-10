import FooterLinks from '@/components/ClientComponents/FooterLinks';
import FooterSearchBar from '@/components/ClientComponents/FooterSearchBar';
import { StyledFooterDescription, StyledFooterSiteMap } from '@/components/StyledComponents/Footer.styled';
import { type ButtonProps } from '@/types/cmsTypes/ButtonProps';
import { type LinkProps } from '@/types/cmsTypes/LinkProps';
import { type SiteMapData } from '@racwa/react-components';
import { type ReactNode } from 'react';

interface InternalFooterProps {
  logo: string;
  searchPlaceholderText: string;
  sitemapData: SiteMapData[];
  links: LinkProps[];
  socialLinks: ButtonProps[];
  footerDescription: ReactNode;
}

function InternalFooter({
  logo,
  searchPlaceholderText,
  sitemapData,
  links,
  socialLinks,
  footerDescription
}: InternalFooterProps) {
  return (
    <>
      <FooterSearchBar placeholderText={searchPlaceholderText} />
      <StyledFooterSiteMap
        footerDescription={
          <StyledFooterDescription container direction='column' gap={2}>
            {footerDescription}
          </StyledFooterDescription>
        }
        siteMapData={sitemapData}
      />
      <FooterLinks logoUrl={logo} links={links} socialLinks={socialLinks} />
    </>
  );
}

export default InternalFooter;
