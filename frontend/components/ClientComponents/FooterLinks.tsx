'use client'
import { type ButtonProps } from '@/types/cmsTypes/ButtonProps'
import { type LinkProps } from '@/types/cmsTypes/LinkProps'
import { type IconName, findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { styled } from '@mui/material'
import { DataDrivenRacwaFooter } from '@racwa/react-components'

const StyledDataDrivenRacwaFooter = styled(DataDrivenRacwaFooter)(({ theme }) => ({
  // TODO: This is not ideal, but adds styling to the list of links in the centre
  // don't want to make a change to the design system otherwise it will disturb insurance
  '& .MuiGrid-root:nth-of-type(2)': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& a': {
      [theme.breakpoints.down('md')]: {
        fontSize: '14px'
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '18px'
      }
    }
  }
}))

export const generateFooterLinks = (links: LinkProps[]) => {
  return links.map((link: LinkProps) => {
    return {
      label: link.longLinkText,
      link: link.linkUrl
    }
  })
}

export const generateSocialLinks = (links: ButtonProps[]) => {
  return links.map((link: ButtonProps) => {
    return {
      title: link.longText,
      link: link.link,
      logo: findIconDefinition({ prefix: 'fab', iconName: link.icon as IconName }),
      logoHoverColor: link.logoHoverColour ?? ''
    }
  })
}

const FooterLinks = ({ logoUrl, links, socialLinks }: { logoUrl: string, links: LinkProps[], socialLinks: ButtonProps[] }) => {
  return (
        <StyledDataDrivenRacwaFooter
            logo={logoUrl}
            footerLinks={generateFooterLinks(links)}
            socialLinks={generateSocialLinks(socialLinks)}
            />
  )
}

export default FooterLinks
