"use client";

import { useState } from "react";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { IconButton, useTheme } from "@mui/material";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";
import { logEvent } from "#utils/analyticsTagging";

import { RacwaTooltip } from "@racwa/react-components";
import { colors } from "@racwa/styles";

export const WordTooltip = ({
  policyCardTitle,
  tooltipTitle,
  tooltipContent,
  label,
  preMessage,
  ariaLabel,
  startPadding = 4,
}: {
  policyCardTitle: string;
  tooltipTitle: string;
  tooltipContent: string | React.ReactNode;
  label: string;
  preMessage?: string;
  ariaLabel: string;
  startPadding?: number;
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <>
      {preMessage && <span style={{ paddingLeft: 4 }}>{preMessage}</span>}
      <RacwaTooltip
        title={tooltipTitle}
        message={tooltipContent}
        open={open}
        onClick={() => {
          setOpen(true);
          logEvent(`Tooltip - ${tooltipTitle} - ${label} - ${policyCardTitle}`);
        }}
        onClickClose={() => {
          setOpen(false);
        }}
        onClickAway={() => {
          setOpen(false);
        }}
      >
        <IconButton
          size="small"
          aria-label={ariaLabel}
          style={{
            background: "none",
            padding: 0,
            lineHeight: theme.typography.body1.lineHeight,
            fontFamily: theme.typography.body1.fontFamily,
          }}
        >
          <span
            aria-label={ariaLabel}
            aria-labelledby="none"
            style={{
              color: colors.linkBlue,
              cursor: "pointer",
              textDecoration: "underline",
              paddingLeft: startPadding,
            }}
          >
            {label}
            <FontAwesomeIcon size="xs" icon={faCaretDown} style={{ paddingLeft: 4 }} />
          </span>
        </IconButton>
      </RacwaTooltip>
    </>
  );
};
