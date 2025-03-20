"use client";

import type { TooltipSchema } from "#graphql/policyDetails/schema";
import type { z } from "zod";
import { useState } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";
import { logEvent } from "#utils/analyticsTagging";
import convertStringToElements from "#utils/convertStringToElements";

import { RacwaTooltip } from "@racwa/react-components";
import { colors } from "@racwa/styles";

type Tooltip = z.infer<typeof TooltipSchema>;

const PropertyTooltip = ({ tooltip }: { tooltip: Tooltip }) => {
  const [open, setOpen] = useState(false);

  return (
    <RacwaTooltip
      {...tooltip}
      message={convertStringToElements(tooltip.message, { fontWeight: "medium", fontSize: "medium" }, tooltip.title)}
      open={open}
      onClick={() => {
        setOpen(true);
        logEvent(`Tooltip - ${tooltip.title}`);
      }}
      onClickClose={() => {
        setOpen(false);
      }}
      onClickAway={() => {
        setOpen(false);
      }}
    >
      <IconButton size="small" aria-label="show tooltip" style={{ padding: 0, marginLeft: 4, alignSelf: "center" }}>
        <FontAwesomeIcon
          style={{
            color: colors.linkBlue,
          }}
          icon={faInfoCircle}
        />
      </IconButton>
    </RacwaTooltip>
  );
};

export default PropertyTooltip;
