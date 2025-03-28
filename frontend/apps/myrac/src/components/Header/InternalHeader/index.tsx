"use client";

import type { PersonSchema } from "#graphql/person/queries/schema";
import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { JSX } from "react";
import type { z } from "zod";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid2 as Grid, Stack } from "@mui/material";
import { logNavClick } from "#utils/analyticsTagging";

import { RacwaLink } from "@racwa/react-components";

import type { RawHeaderSchema } from "../schema";
import { HamburgerMenuButton } from "../HamburgerMenuButton";
import HeaderSearchBar from "../HeaderSearchBar";
import LoginButton from "../LoginButton";
import MobileUserMenu from "../MobileUserMenu";
import { StyledFlexibleContainer, StyledResponsiveHeader, StyledSearchButton } from "./styled";

type InternalHeaderProps = {
  headerData: z.infer<typeof RawHeaderSchema>;
  breadcrumbs?: JSX.Element[];
  person?: z.infer<typeof PersonSchema>;
};

export default function InternalHeader({ headerData, breadcrumbs, person }: InternalHeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

  return (
    <StyledResponsiveHeader
      enableMobileViewForTabletScreens={true}
      breadcrumbs={breadcrumbs}
      stickyDesktopHeader={false}
      startAction={
        <StyledSearchButton
          size="small"
          open={mobileSearchOpen}
          onClick={() => {
            setMobileSearchOpen((current) => !current);
          }}
        >
          <FontAwesomeIcon icon="search" fontSize={18} />
        </StyledSearchButton>
      }
      endAction={
        <HamburgerMenuButton
          open={mobileUserMenuOpen}
          toggleAction={() => {
            setMobileUserMenuOpen((current) => !current);
            const navAction = !mobileUserMenuOpen ? "Open" : "Close";
            logNavClick(`Hamburger menu - ${navAction}`);
          }}
          firstName={person?.firstName}
        />
      }
      flexibleContainerOpen={mobileSearchOpen || mobileUserMenuOpen}
      flexibleContainerContent={
        <StyledFlexibleContainer container direction="column">
          {mobileSearchOpen && (
            <Grid padding={1}>
              <HeaderSearchBar placeholder="Search" fullWidth />
            </Grid>
          )}
          {mobileUserMenuOpen && (
            <MobileUserMenu
              memberFullName={`${person?.firstName} ${person?.surname}`}
              userMenu={headerData.userMenu.menuItems.items}
              mobileLinks={headerData.mobileLinks.items}
            />
          )}
        </StyledFlexibleContainer>
      }
    >
      <Stack direction="row" alignItems="center" gap={3}>
        {headerData.links.items.map((item: z.infer<typeof ContentfulLinkSchema>) => {
          return (
            <RacwaLink key={item.longLinkText} link={item.linkUrl ?? ""} sx={{ fontSize: 14 }}>
              {item.linkUrl?.startsWith("tel:") && (
                <FontAwesomeIcon icon="phone" style={{ marginRight: 1, fontSize: "12px" }} />
              )}
              {item.longLinkText}
            </RacwaLink>
          );
        })}
      </Stack>
      <Stack direction="row" alignItems="center" gap={1} paddingLeft={3}>
        <HeaderSearchBar placeholder={headerData.searchBar.placeholderText} />
        <LoginButton userMenu={headerData.userMenu.menuItems.items} memberFirstName={person?.firstName} />
      </Stack>
    </StyledResponsiveHeader>
  );
}
