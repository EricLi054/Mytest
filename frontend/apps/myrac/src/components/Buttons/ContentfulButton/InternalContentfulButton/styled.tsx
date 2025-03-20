"use client";

import type { ButtonProps } from "@mui/material";
import type { PropsWithChildren } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, styled } from "@mui/material";
import { logEvent } from "#utils/analyticsTagging";

import { RacwaChevronButton } from "@racwa/react-components";
import { colors } from "@racwa/styles";

type GAButtonProps = {
  gavalue?: string;
} & PropsWithChildren<ButtonProps>;

const GAButton = ({ children, ...props }: GAButtonProps) => {
  return (
    <Button
      {...props}
      LinkComponent={Link}
      onClick={() => {
        if (props.gavalue) logEvent(props.gavalue);
      }}
    >
      {children}
    </Button>
  );
};

const GAChevronButton = ({ children, ...props }: GAButtonProps) => {
  return (
    <RacwaChevronButton
      {...props}
      LinkComponent={Link}
      onClick={() => {
        if (props.gavalue) logEvent(props.gavalue);
      }}
    >
      {children}
    </RacwaChevronButton>
  );
};

export const StyledButton = styled(GAButton)(({ theme }) => ({
  width: "100%",
  boxShadow: "0 1px 1px rgba(0,0,0,.1)",
  padding: 15,
  color: colors.dieselDeep,
  fontSize: 18,
  fontWeight: 600,
  border: 0,
  height: "auto",
  justifyContent: "start",
  [theme.breakpoints.up("md")]: {
    padding: 20,
    fontSize: 20,
    minHeight: 102,
    justifyContent: "center",
  },
}));

export const StyledChevronButton = styled(GAChevronButton)(() => ({
  fontWeight: 400,
}));

export const StyledIconButton = styled(GAButton, { shouldForwardProp: (prop) => prop !== "border" })<{
  border: boolean;
}>(({ border }) => ({
  fontWeight: 400,
  border: border ? `1px solid ${colors.dieselLight}` : "none",
}));

export const StyledImageButton = styled(StyledButton)(({ theme }) => ({
  fontWeight: 400,
  [theme.breakpoints.up("sm")]: {
    padding: "30px 20px",
    fontSize: 20,
  },
}));

export const StyledProfileLinkButton = styled(GAButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  height: "auto",
  width: "100%",
  padding: theme.spacing(3),
  border: `1px solid ${colors.racGray}`,
  "&:hover": {
    boxShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    backgroundColor: colors.racGrayLight,
  },
}));

export const StyledFAIcon = styled(FontAwesomeIcon)(({ theme }) => ({
  fontSize: 16,
  [theme.breakpoints.up("sm")]: {
    fontSize: 24,
  },
}));

export const StyledBannerButton = styled(GAButton)(({ theme }) => ({
  justifyContent: "flex-start",
  height: "auto",
  gap: theme.spacing(1),
  fontSize: theme.typography.button.fontSize,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    justifyContent: "center",
    textAlign: "center",
    minHeight: theme.spacing(7),
    minWidth: theme.spacing(9),
  },
}));

export const BreakpointControlledText = styled("span", {
  shouldForwardProp: (prop) => prop !== "deviceVisibility",
})<{ deviceVisibility: "mobile" | "desktop" }>(({ theme, deviceVisibility }) => ({
  ...(deviceVisibility === "desktop" && {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  }),
  ...(deviceVisibility === "mobile" && {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  }),
}));
