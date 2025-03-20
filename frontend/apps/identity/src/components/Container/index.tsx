import type { SxProps } from "@mui/material";
import type { PropsWithChildren } from "react";
import { Box } from "@mui/material";

export type ContainerProps = PropsWithChildren<{
  sx?: SxProps;
}>;

export default function Container({ children, sx = {} }: ContainerProps) {
  return (
    <Box
      mt={4}
      px={3}
      py={5}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        background: "white",
        borderRadius: "8px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
