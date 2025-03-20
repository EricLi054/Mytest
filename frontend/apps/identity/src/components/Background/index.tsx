"use client";

import type { PropsWithChildren } from "react";
import { styled } from "@mui/material";

export function Background({ children }: PropsWithChildren) {
  return <StyledDiv>{children}</StyledDiv>;
}

const StyledDiv = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  height: "100vh",
  width: "100vw",
  backgroundImage: "url('https://res.rac.com.au/image/upload/v1733099882/Identity/registration-background.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  overflowY: "auto",
});
