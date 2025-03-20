"use client";

import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";

import { styles } from "./styles";

const TextResizer = () => {
  const [textSize, setTextSize] = useState(15);

  const resizeText = (size: number) => {
    const baseSize = 15;
    const scaleFactor = size / baseSize;

    const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        const originalSize =
          parseFloat(window.getComputedStyle(el).getPropertyValue("--original-font-size")) ||
          parseFloat(window.getComputedStyle(el).fontSize);
        el.style.setProperty("--original-font-size", `${originalSize}px`);
        el.style.fontSize = `${originalSize * scaleFactor}px`;
      }
    });
  };

  useEffect(() => {
    setTextSize(15);
  }, []);

  return (
    <>
      <Typography component="p" variant="small" color="text.secondary" m={0}>
        Text size
      </Typography>
      {[12, 15, 18].map((size) => (
        <Button
          key={size}
          role="button"
          variant="outlined"
          size="small"
          sx={styles.contentTextSizeUtilButton(textSize === size, size)}
          className={
            size === 12 ? "small-text-icon" : size === 15 ? "medium-text-icon" : size === 18 ? "large-text-icon" : ""
          }
          onClick={() => {
            setTextSize(size);
            resizeText(size);
          }}
        >
          A
        </Button>
      ))}
    </>
  );
};

export default TextResizer;
