"use client";

import { Grid2 as Grid } from "@mui/material";

import { BodyCopy } from "@racwa/react-components";

import type { PolicyItem } from "../types";
import PropertyTooltip from "../PropertyTooltip";
import { WordTooltip } from "../WordTooltip";
import { createBundledAmountMessage, createPaymentFrequencyMessage, createPaymentMethodMessage } from "./util";

export const PolicyItemComponent = ({
  policyItem,
  policyCardTitle,
}: {
  policyItem: PolicyItem;
  policyCardTitle: string;
}) => {
  return (
    <Grid>
      <BodyCopy>{policyItem.label}</BodyCopy>
      <BodyCopy fontWeight="medium" display="flex" alignItems="baseline">
        <span>{policyItem.value}</span>
        {policyItem.tooltip ? <PropertyTooltip tooltip={policyItem.tooltip} /> : null}
        {policyItem.bundledAmount ? (
          <WordTooltip
            policyCardTitle={policyCardTitle}
            tooltipTitle={policyItem.bundledAmount.title ?? ""}
            tooltipContent={createBundledAmountMessage(policyItem.bundledAmount)}
            label={policyItem.bundledAmount.label ?? ""}
            ariaLabel="show bundled payment tooltip"
            startPadding={policyItem.value ? 8 : 0}
          />
        ) : null}
        {policyItem.paymentMethod ? (
          <WordTooltip
            policyCardTitle={policyCardTitle}
            tooltipTitle={policyItem.paymentMethod.title}
            tooltipContent={createPaymentMethodMessage(policyItem.paymentMethod)}
            label={policyItem.paymentMethod.type}
            ariaLabel="show payment method tooltip"
          />
        ) : null}
        {policyItem.paymentFrequency ? (
          <WordTooltip
            policyCardTitle={policyCardTitle}
            tooltipTitle={policyItem.paymentFrequency.title}
            tooltipContent={createPaymentFrequencyMessage(policyItem.paymentFrequency)}
            label={policyItem.paymentFrequency.frequency ?? "Frequency"}
            preMessage={policyItem.paymentFrequency.preMessage ?? "paying"}
            ariaLabel="show payment frequency tooltip"
          />
        ) : null}
      </BodyCopy>
    </Grid>
  );
};
