import type { TooltipProps } from "@mui/material/Tooltip";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

import { colors } from "@racwa/styles";

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip classes={{ tooltip: className }} {...props} />
))(() => ({
  color: colors.dieselDeeper,
  backgroundColor: colors.racGrayLight,
  fontSize: "14px",
  fontWeight: "400",
  padding: "4px 8px",
}));
