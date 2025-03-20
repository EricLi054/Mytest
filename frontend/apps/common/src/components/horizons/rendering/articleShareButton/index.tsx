"use client";

import { useEffect, useState } from "react";
import ShareIcon from "@mui/icons-material/IosShareRounded";
import { IconButton } from "@mui/material";

type ShareButtonProps = {
  heading: string;
  leadParagraph: string;
};

const ShareButton = ({ heading, leadParagraph }: ShareButtonProps) => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(!!navigator.share);
  }, []);

  const handleShare = async () => {
    if (isSupported) {
      try {
        await navigator.share({
          title: `${heading} - RAC Horizons`,
          text: leadParagraph,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <>
      {isSupported && (
        <IconButton aria-label="share" onClick={handleShare} className="share-icon">
          <ShareIcon fontSize="small" />
        </IconButton>
      )}
    </>
  );
};

export default ShareButton;
