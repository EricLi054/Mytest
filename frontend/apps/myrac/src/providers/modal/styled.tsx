"use client";

import { styled } from "@mui/material";

import { RacwaDetailedDialog } from "@racwa/react-components";
import { colors } from "@racwa/styles";

export const StyledGlobalModal = styled(RacwaDetailedDialog, { shouldForwardProp: (prop) => prop !== "isFullScreen" })<{
  isFullScreen: boolean;
}>(({ isFullScreen }) => ({
  h2: {
    fontSize: 26,
  },
  ...(isFullScreen && {
    ".MuiPaper-root": {
      margin: 0,
      height: "100%",
      width: "100%",
      maxHeight: "unset",
      maxWidth: "unset",
      borderTop: "none",
      padding: "0 16px 32px 16px",
      '[aria-label="close"]': {
        color: colors.dieselDeepest,
        fontSize: "20px",
        top: "22px",
        right: "22px",
      },
    },
  }),
}));
