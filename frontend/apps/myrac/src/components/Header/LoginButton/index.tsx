"use client";

import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ClickAwayListener, Grid2 as Grid, Grow, Popper, Typography } from "@mui/material";
import { useEnvironmentVariables } from "#providers/environmentVariables/context";
import { logNavClick } from "#utils/analyticsTagging";
import { signIn, signOut, useSession } from "next-auth/react";

import { getADB2CLogoutUrl } from "@racwa/auth/adb2c";

import { StyledDropdownButton, StyledLogoutButton, StyledMenuFooter, StyledMenuList, StyledPaper } from "./styled";
import { getMenuLinks, getTitleLink } from "./util";

export default function LoginButton({
  memberFirstName,
  userMenu,
}: {
  memberFirstName?: string;
  userMenu: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>;
}) {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const env = useEnvironmentVariables();

  const logOutLocalAndSession = async () => {
    const logoutUrl = await getADB2CLogoutUrl(window.location.origin);
    await signOut();
    router.push(logoutUrl);
  };

  if (status === "authenticated") {
    return (
      <>
        <StyledDropdownButton
          color="secondary"
          size="small"
          aria-controls={open ? "user-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          onClick={() => {
            setOpen((prevOpen) => !prevOpen);
            logNavClick("myRAC - First name dropdown");
          }}
          aria-label="user-menu-toggle"
          ref={anchorRef}
        >
          <FontAwesomeIcon icon="user" />
          <Typography variant="body1" fontSize={14} fontWeight={400} marginX={".3em"}>
            {memberFirstName}
          </Typography>
          <FontAwesomeIcon icon="caret-down" />
        </StyledDropdownButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          placement="bottom-end"
          sx={{ zIndex: 10 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <StyledPaper>
                <ClickAwayListener
                  onClickAway={(event) => {
                    if (anchorRef.current === event.target) {
                      return;
                    }
                    setOpen(false);
                  }}
                >
                  <StyledMenuList id="user-menu">
                    {userMenu.length > 0 && getTitleLink(userMenu)}
                    <Grid container direction="column">
                      {userMenu.length > 1 && getMenuLinks(userMenu, env)}
                      <StyledMenuFooter>
                        <StyledLogoutButton
                          color="primary"
                          size="small"
                          fullWidth
                          onClick={async () => {
                            logNavClick("myRAC - Log out");
                            await logOutLocalAndSession();
                          }}
                        >
                          <FontAwesomeIcon icon="sign-out-alt" style={{ paddingRight: "0.3em" }} />
                          Log out
                        </StyledLogoutButton>
                      </StyledMenuFooter>
                    </Grid>
                  </StyledMenuList>
                </ClickAwayListener>
              </StyledPaper>
            </Grow>
          )}
        </Popper>
      </>
    );
  } else if (status === "unauthenticated") {
    return (
      <Button
        color="primary"
        size="small"
        onClick={async () => {
          await signIn();
        }}
      >
        <FontAwesomeIcon icon="user" style={{ paddingRight: "0.3em" }} />
        Log in or register
      </Button>
    );
  } else {
    return null;
  }
}
