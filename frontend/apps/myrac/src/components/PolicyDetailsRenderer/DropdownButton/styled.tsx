import Link from "next/link";
import { Button, Paper, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const StyledButton = styled(Button)(() => ({
  padding: "10px 30px",
  height: "3rem",
  fontSize: 18,
}));

export const StyledPaper = styled(Paper)(() => ({
  backgroundColor: "white",
  minWidth: 160,
}));

export const StyledDropdownLink = styled(Link)(() => ({
  textDecoration: "none",
  color: colors.dieselDeeper,
  fontSize: 18,
  fontWeight: 400,
  padding: "3px 20px",
  "&:hover": {
    backgroundColor: colors.racGrayLight,
  },
}));
