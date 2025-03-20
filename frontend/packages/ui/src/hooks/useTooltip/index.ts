"use client";

import { useState } from "react";

import type { TooltipProps } from "@racwa/react-components";

export const useTooltip = () => {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return {
    open,
    onClick: () => setOpen(!open),
    onClickClose: close,
    onClickAway: close,
  } satisfies Pick<TooltipProps, "open" | "onClick" | "onClickClose" | "onClickAway">;
};

export default useTooltip;
