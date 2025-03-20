import type { Category, ContentfulCategoryCollectionData } from "#types/horizons/category";
import type { MenuItem } from "#types/horizons/menuItem";
import NextLink from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Container, IconButton, Link, Typography } from "@mui/material";
import { getCategories } from "#components/horizons/cms/category/data";
import { GlobalStyles } from "#styles/globalStyles";

import { HorizonsLogo } from "../logos/horizonsLogo";
import { RACLogo } from "../logos/racLogo";
import { styles } from "./styles";

const fetchCategories = async () => {
  try {
    const data = await getCategories();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function Footer() {
  const contentfulData: ContentfulCategoryCollectionData =
    (await fetchCategories()) as ContentfulCategoryCollectionData;

  if (!contentfulData) {
    return <></>;
  }

  const categoryContentItems = contentfulData.data.horizons_categoryCollection.items;

  if (!categoryContentItems.length || categoryContentItems.length === 0) {
    return <></>;
  }

  const menuItems: MenuItem[] = categoryContentItems.map((category: Category) => ({
    name: category.name,
    slug: category.slug,
    selected: false,
    contextualColour: "#000000",
  }));

  const legalLinks: MenuItem[] = [
    {
      name: "Privacy",
      slug: "/about-rac/site-info/privacy",
      contextualColour: "#000000",
      selected: false,
    },
    {
      name: "Disclaimer",
      slug: "/about-rac/site-info/disclaimer",
      contextualColour: "#000000",
      selected: false,
    },
    {
      name: "Security",
      slug: "/about-rac/site-info/security",
      contextualColour: "#000000",
      selected: false,
    },
    {
      name: "Accessibility",
      slug: "/about-rac/site-info/accessibility",
      contextualColour: "#000000",
      selected: false,
    },
  ];

  return (
    <Box component="footer" sx={styles.footerBox}>
      <Container maxWidth="lg">
        <Box component="section" sx={styles.footerTopSection}>
          <Box sx={styles.footerPrimaryLogo}>
            <HorizonsLogo width={122} height={24} />
          </Box>
          <Box component="nav" sx={styles.footerMainNavLinks}>
            <Box component="ul" pl={0} m={0}>
              {menuItems.map((item) => (
                <Box component="li" key={item.name} display="inline-flex" px={1}>
                  <Link
                    component={NextLink}
                    href={`/horizons/${item.slug}`}
                    sx={styles.footerNavLink}
                    underline="none"
                    className="footer-link"
                  >
                    {item.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={styles.footerSecondaryLogo}>
            <RACLogo width={45} height={40} />
          </Box>
        </Box>
        <Box component="section" mb={2}>
          <Typography variant="finePrint" sx={GlobalStyles.textUnderline} my={0}>
            <b>RAC WA</b>
          </Typography>
          <Typography variant="finePrint" my={0}>
            832 Wellington Street,
          </Typography>
          <Typography variant="finePrint" my={0}>
            West Perth, Western Australia, 6005
          </Typography>
          <Typography variant="finePrint" my={2}>
            RAC acknowledges and pays respects to the Traditional Custodians throughout Australia. We recognise the
            continuing connection to land, waters and community.
          </Typography>
          <Typography variant="finePrint" my={0}>
            © {new Date().getFullYear()} The Royal Automobile Club of WA (Inc.)
          </Typography>
        </Box>
        <Box component="nav" sx={styles.footerBottomSection}>
          <Box component="ul" pl={0} m={0} sx={styles.footerLegalLinks}>
            {legalLinks.map((item) => (
              <Box component="li" key={item.name} display="inline-flex" pr={1}>
                <Link
                  component={NextLink}
                  href={item.slug}
                  sx={styles.footerLegalLink}
                  underline="none"
                  className="footer-link"
                >
                  {item.name}
                </Link>
              </Box>
            ))}
          </Box>
          <Box component="ul" pl={0} m={0} sx={styles.footerSocialIcons}>
            <Box component="li" display="inline-flex">
              <IconButton aria-label="YouTube" color="inherit" className="footer-link">
                <YouTubeIcon sx={styles.footerSocialIcon} className="footer-link" />
              </IconButton>
            </Box>
            <Box component="li" display="inline-flex">
              <IconButton aria-label="Instagram" color="inherit" className="footer-link">
                <InstagramIcon sx={styles.footerSocialIcon} className="footer-link" />
              </IconButton>
            </Box>
            <Box component="li" display="inline-flex">
              <IconButton aria-label="Facebook" color="inherit" className="footer-link">
                <FacebookIcon sx={styles.footerSocialIcon} className="footer-link" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
