"use client";

import type { Document } from "@contentful/rich-text-types";
import type { RichTextContentSchema } from "#contentful/schema";
import type { z } from "zod";
import React from "react";

import type { TooltipProps } from "@racwa/react-components";
import { RacwaTooltip } from "@racwa/react-components";

import RichTextRenderer from "../RichTextRenderer";

type ContentfulTooltipProps = Omit<TooltipProps, "message"> & {
  message: z.infer<typeof RichTextContentSchema>;
};

export const generateContentfulTooltipProps = ({ message, ...props }: ContentfulTooltipProps) => ({
  ...props,
  message: <RichTextRenderer json={message.json as Document} paragraphProps={{ paragraph: true }} />,
});

const ContentfulTooltip: React.FC<ContentfulTooltipProps> = ({ title, message, onClick }) => {
  const tooltipProps = generateContentfulTooltipProps({ title, message, onClick });

  return <RacwaTooltip {...tooltipProps} onClickClose={() => console.log("Click tooltip")} />;
};

export default ContentfulTooltip;
