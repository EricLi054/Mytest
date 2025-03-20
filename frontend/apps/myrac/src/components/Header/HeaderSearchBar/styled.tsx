import { Button, InputAdornment, OutlinedInput, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const StyledSearchButton = styled(Button)(({ theme }) => ({
  width: theme.spacing(1),
  fontSize: 14,
  border: 0,
  minWidth: 0,
  height: "auto",
  color: "white",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export const StyledInputAdornment = styled(InputAdornment)(() => ({
  marginRight: "-14px",
}));

export const StyledOutlinedInput = styled(OutlinedInput, { shouldForwardProp: (prop) => prop !== "fullWidth" })<{
  fullWidth: boolean;
}>(({ fullWidth }) => ({
  fontWeight: 400,
  fontSize: 14,
  color: "white",
  backgroundColor: colors.dieselDeep,
  width: fullWidth ? "100%" : 150,
  height: "2rem",
  transition: "all ease-in-out .15s",
  "&:hover": {
    color: colors.dieselDeep,
    backgroundColor: "white",
    width: fullWidth ? "100%" : 250,
    "& button": {
      color: colors.linkBlue,
      "&:hover": {
        color: colors.racYellow,
      },
    },
  },
  "& fieldset": {
    border: 0,
  },
}));
