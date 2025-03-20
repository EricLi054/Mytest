"use client";

import { useCallback, useRef, useState } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClickAwayListener, Grid2 as Grid, Grow, MenuList, Popper } from "@mui/material";
import { logEvent } from "#utils/analyticsTagging";

import { BodyCopy } from "@racwa/react-components";

import type { DropdownLink } from "../types";
import type { DropdownButtonProps } from "./types";
import { StyledButton, StyledDropdownLink, StyledPaper } from "./styled";

function DropdownButton({ children, menuItems, sx, primaryLabel, color }: DropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
    logEvent(`Click - ${primaryLabel}`);
  }, [setOpen, primaryLabel]);

  const handleClose = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (anchorRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    },
    [anchorRef, setOpen],
  );

  return (
    <>
      <StyledButton
        color={color}
        size="small"
        aria-controls={open ? "menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="menu"
        onClick={handleToggle}
        aria-label="user-menu-toggle"
        ref={anchorRef}
        sx={sx}
      >
        {children}
        <FontAwesomeIcon size="sm" icon={faAngleDown} style={{ marginLeft: 20 }} />
      </StyledButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-start"
        sx={{ zIndex: 10 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <StyledPaper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="menu">
                  <Grid container direction="column">
                    {menuItems.map((menuItem: DropdownLink) => {
                      return (
                        <StyledDropdownLink
                          key={menuItem.label}
                          href={menuItem.link}
                          onClick={() => {
                            logEvent(menuItem.analytics?.description ?? "");
                          }}
                        >
                          <BodyCopy fontWeight={menuItem.subLabel ? "light" : "medium"}>{menuItem.label}</BodyCopy>
                          {menuItem.subLabel && <BodyCopy fontWeight={"medium"}>{menuItem.subLabel}</BodyCopy>}
                        </StyledDropdownLink>
                      );
                    })}
                  </Grid>
                </MenuList>
              </ClickAwayListener>
            </StyledPaper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default DropdownButton;
