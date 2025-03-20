import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import { styles } from "./styles";

type WhiteBarProps = {
  firstMenuItemRef: React.RefObject<HTMLButtonElement | null>;
};

export default function WhiteBar({ firstMenuItemRef }: WhiteBarProps) {
  const [firstMenuItemOffsetLeft, setFirstMenuItemOffsetLeft] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (firstMenuItemRef.current) {
      setFirstMenuItemOffsetLeft(firstMenuItemRef.current.offsetLeft);
    }
  }, [windowWidth, firstMenuItemRef]);

  return (
    <Box component="aside" sx={styles.bar(firstMenuItemOffsetLeft + 38)}>
      <Box component="div" sx={styles.triangle} />
    </Box>
  );
}
