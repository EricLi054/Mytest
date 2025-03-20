import { Button, Grid2 as Grid, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const StyledHamburgerButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  padding: "5px 5px 5px 11px",
  borderRadius: "26px",
  height: "100%",
  border: 0,
  color: open ? colors.white : colors.dieselDeepest,
  backgroundColor: open ? colors.dieselDeepest : colors.white,
  "&:hover": {
    backgroundColor: open ? colors.dieselDeepest : colors.white,
  },
}));

export const StyledUserIcon = styled(Grid)(() => ({
  width: "30px",
  height: "30px",
  borderRadius: "999px",
  color: colors.dieselDeepest,
  backgroundColor: colors.subtleBg,
  "&:hover": {
    backgroundColor: colors.subtleBg,
  },
}));
