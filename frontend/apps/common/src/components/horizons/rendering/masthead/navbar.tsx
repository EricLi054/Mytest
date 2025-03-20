"use client";

import type { Category } from "#types/horizons/category";
import type { MenuItem } from "#types/horizons/menuItem";
import { useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Button, Container, Drawer, IconButton, Toolbar } from "@mui/material";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

import { HorizonsLogo } from "../logos/horizonsLogo";
import { RACLogo } from "../logos/racLogo";
import { styles } from "./styles";
import WhiteBar from "./whiteBar";

type NavbarProps = {
  categories: Category[];
};

const Navbar = ({ categories }: NavbarProps) => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const firstMenuItemRef = useRef<HTMLButtonElement | null>(null);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
    if (
      (event.type === "keydown" && (event as React.KeyboardEvent).key === "Tab") ||
      (event as React.KeyboardEvent).key === "Shift"
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const menuItems: MenuItem[] = categories.map((category: Category) => ({
    name: category.name,
    slug: category.slug,
    selected: pathname.startsWith(`/horizons/${category.slug}`),
    contextualColour: getAccentColourFromCategoryColour(category.colour),
  }));

  return (
    <>
      <Box component="nav" sx={styles.desktopMenu}>
        <AppBar position="relative" sx={styles.desktopMenuAppBar}>
          <Toolbar component="section" sx={styles.desktopMenuUtilityToolbar} disableGutters>
            <Container maxWidth="lg">
              <Box display="flex" alignItems="center" gap={2}>
                <RACLogo width={41} height={36} />
                <Button
                  variant="text"
                  LinkComponent={NextLink}
                  href="/"
                  title="Visit RAC"
                  size="small"
                  color="secondary"
                >
                  Visit RAC
                </Button>
              </Box>
            </Container>
          </Toolbar>

          <Toolbar component="section" sx={styles.desktopMenuPrimaryToolbar} disableGutters>
            <Container maxWidth="lg">
              <Box sx={styles.navBarLogoAndMenuItemsWrapper}>
                <HorizonsLogo width={219} height={43} />
                <Box component="ul" sx={styles.navBarMenuItemsWrapper} ref={firstMenuItemRef}>
                  {menuItems.map((item: MenuItem) => (
                    <Box component="li" key={item.name} display="inline-flex" height={80}>
                      <Button
                        variant="text"
                        sx={styles.menuItem(item)}
                        role="button"
                        size="medium"
                        href={`/horizons/${item.slug}`}
                        className="navigation-menu-link"
                      >
                        {item.name}
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
        <WhiteBar firstMenuItemRef={firstMenuItemRef} />
      </Box>
      <Box component="nav" sx={styles.mobileMenu}>
        <AppBar position="relative" color="inherit" elevation={0}>
          <Toolbar component="section" disableGutters sx={styles.topBarToolbar}>
            <Container maxWidth="lg">
              <Box sx={styles.topBar}>
                <Box sx={styles.topBarLogoWrapper}>
                  <Box order={1} sx={styles.topBarLogoPrimary}>
                    <RACLogo width={46} height={40} />
                  </Box>
                  <Box sx={styles.topBarLogoSecondary}>
                    <HorizonsLogo width={127} height={25} />
                  </Box>
                </Box>
                <Box sx={styles.topBarLogoWrapper}>
                  <Box order={2} sx={styles.topBarLogoPrimary}>
                    <HorizonsLogo width={127} height={25} />
                  </Box>
                  <Box sx={styles.topBarLogoSecondary}>
                    <RACLogo width={46} height={40} />
                  </Box>
                </Box>
                <Box sx={styles.topBarMobileMenuIcon}>
                  <IconButton color="primary" onClick={toggleDrawer(true)} className="navigation-menu-link">
                    <MenuIcon className="navigation-menu-link" />
                  </IconButton>
                </Box>
              </Box>
            </Container>
          </Toolbar>

          <Drawer component="section" anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={styles.drawer} role="presentation">
              <Box component="ul" pt={2} pl={0} m={0}>
                <Box component="li">
                  <Button sx={styles.drawerMenuItem} role="button" href="/horizons">
                    Home
                  </Button>
                </Box>
                {menuItems.map((item: MenuItem) => (
                  <Box component="li" key={item.name}>
                    <Button
                      sx={styles.drawerMenuItem}
                      role="button"
                      href={`/horizons/${item.slug}`}
                      className="navigation-menu-link"
                    >
                      {item.name}
                    </Button>
                  </Box>
                ))}
              </Box>
              <Box component="aside" display="flex" mt={"auto"} py={2} px={2}>
                <RACLogo width={27} height={24} />
                <Button
                  variant="text"
                  LinkComponent={NextLink}
                  href="/"
                  title="Visit RAC"
                  size="small"
                  color="primary"
                  sx={{ ml: 1.5 }}
                >
                  Visit RAC
                </Button>
              </Box>
            </Box>
          </Drawer>
        </AppBar>
        {isDrawerOpen && (
          <Box sx={styles.drawerCloseButton}>
            <IconButton color="primary" onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Navbar;
