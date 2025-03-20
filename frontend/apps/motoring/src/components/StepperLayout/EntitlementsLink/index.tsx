"use client";

import { Box, Link, styled, Typography } from "@mui/material";
import { EMPTY_URL } from "#constants";

export type EntitlementsLinkProps = {
  url: string;
  onClick?: () => void;
};

const StyledBox = styled(Box)(({ theme }) => ({
  padding: "0px 0px 24px 0px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    padding: "0px 0px 32px 0px",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: "0px 0px 24px 0px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    padding: "0px 0px 32px 0px",
  },
}));

export default function EntitlementsLink({ url, onClick }: EntitlementsLinkProps) {
  return (
    <StyledBox>
      <StyledTypography variant="h4">
        View{" "}
        <Link
          variant="inherit"
          color="inherit"
          href={url.trim() || EMPTY_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            onClick?.();
          }}
        >
          Roadside Assistance Entitlements
        </Link>
      </StyledTypography>
    </StyledBox>
  );
}
