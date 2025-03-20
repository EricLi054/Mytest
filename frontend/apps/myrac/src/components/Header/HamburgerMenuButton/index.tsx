"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid2 as Grid, Typography } from "@mui/material";

import { StyledHamburgerButton, StyledUserIcon } from "./styled";

export const HamburgerMenuButton = ({
  open,
  toggleAction,
  firstName,
}: {
  open: boolean;
  toggleAction: () => void;
  firstName?: string;
}) => {
  return (
    <StyledHamburgerButton open={open} onClick={toggleAction}>
      <Grid container spacing="6px" alignItems="center">
        <FontAwesomeIcon icon="bars" fontSize="18px" width={16} />
        <StyledUserIcon container alignItems="center" justifyContent="center">
          {firstName ? (
            <Typography fontWeight={500} fontSize={14}>
              {firstName.charAt(0).toLocaleUpperCase()}
            </Typography>
          ) : (
            <FontAwesomeIcon icon="user" fontSize="14px" />
          )}
        </StyledUserIcon>
      </Grid>
    </StyledHamburgerButton>
  );
};
