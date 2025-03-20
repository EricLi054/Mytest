import { styled, TextField } from "@mui/material";

export const StyledTextInput = styled(TextField)({
  "& > div": {
    paddingRight: "50px !important",
  },
  "& input::-webkit-search-cancel-button": {
    display: "none",
  },
  "&&&& input": {
    paddingBottom: "4.5px",
    paddingLeft: "6px",
    paddingRight: "4px",
    paddingTop: "4.5px",
  },
});
