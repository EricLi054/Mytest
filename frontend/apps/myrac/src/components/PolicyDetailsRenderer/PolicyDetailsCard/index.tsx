"use client";

import type { PolicyDetailsCardProps } from "../types";
import { CardContent } from "../CardContent";
import { StyledBox } from "./styled";

export default function PolicyDetailsCard(props: PolicyDetailsCardProps) {
  const { data } = props;

  return <StyledBox>{CardContent(data)}</StyledBox>;
}
