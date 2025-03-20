import type { ButtonProps, SxProps, Theme } from "@mui/material";
import type { PropsWithChildren } from "react";

import type { DropdownLink } from "../types";

export type DropdownButtonProps = {
  menuItems: DropdownLink[];
  sx?: SxProps<Theme>;
  /* Use for analytics event on button click */
  primaryLabel: string;
} & PropsWithChildren &
  Pick<ButtonProps, "color">;
