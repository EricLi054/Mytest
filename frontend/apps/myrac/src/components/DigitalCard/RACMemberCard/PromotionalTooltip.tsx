"use client";

import type { TooltipProps } from "@mui/material";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, Stack, styled, Tooltip, tooltipClasses, Typography } from "@mui/material";

import { colors } from "@racwa/styles";

type PromotionalTooltipProps = {
  tooltipOpen: boolean;
  closeTooltip: () => void;
} & Omit<TooltipProps, "title">;

const TooltipContent = ({ closeTooltip }: { closeTooltip: () => void }) => {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Typography variant="body1">
        <strong>Add card to your mobile wallet</strong>
      </Typography>
      <IconButton onClick={closeTooltip} sx={{ padding: 0, color: colors.dieselDeeper }}>
        <FontAwesomeIcon icon={faTimes} />
      </IconButton>
    </Stack>
  );
};

const InternalPromotionalTooltip = ({
  tooltipOpen,
  closeTooltip,
  children,
  className,
  ...props
}: PromotionalTooltipProps) => {
  return (
    <Tooltip
      {...props}
      classes={{ popper: className }}
      title={<TooltipContent closeTooltip={closeTooltip} />}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 6],
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["top-end"],
              },
            },
          ],
        },
      }}
      open={tooltipOpen}
      placement="top-start"
      arrow
    >
      {children}
    </Tooltip>
  );
};

const PromotionalTooltip = styled(InternalPromotionalTooltip)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: colors.white,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.6)",
    color: "inherit",
    borderRadius: 4,
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    maxWidth: "none",
  },
  [`&[data-popper-placement*="top"] .${tooltipClasses.arrow}`]: {
    marginBottom: `calc(${theme.spacing(-4)} + 1px)`,
  },
  // Unfortunately !important is the MUI support recommendation to position this arrow... https://github.com/mui/material-ui/issues/37651
  [`&[data-popper-placement="top-start"] .${tooltipClasses.arrow}`]: {
    transform: "translate(10px, 0px) !important",
  },
  [`&[data-popper-placement="top-end"] .${tooltipClasses.arrow}`]: {
    left: "auto !important",
    right: "0 !important",
    transform: "translate(-10px, 0px) !important",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: colors.white,
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  [`& .${tooltipClasses.arrow}::before`]: {
    borderRadius: 4,
    transform: "translate(6px, -7px) rotate(45deg)",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.6)",
  },
}));

export default PromotionalTooltip;
