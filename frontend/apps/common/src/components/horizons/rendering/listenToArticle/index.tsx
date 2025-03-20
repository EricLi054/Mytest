"use client";

import { useEffect, useState } from "react";
import HeadphonesSharp from "@mui/icons-material/HeadphonesSharp";
import { IconButton } from "@mui/material";

import { styles } from "./styles";

type ListenToArticleProps = {
  plainTextPageContent: string;
};

const ListenToArticle = ({ plainTextPageContent }: ListenToArticleProps) => {
  const [isReading, setIsReading] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const desiredVoice = voices.find((v) => v.lang === "en-US" && v.name.includes("Aria"));
      setVoice(desiredVoice ?? null);
    };
    loadVoices();

    const handleBeforeUnload = () => {
      return window.speechSynthesis.cancel();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleArticleListen = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(plainTextPageContent);
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.onend = () => setIsReading(false);

    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  };
  return (
    <IconButton
      aria-label="headphones"
      sx={styles.contentHeadphonesIcon}
      onClick={handleArticleListen}
      className="listen-icon"
    >
      <HeadphonesSharp fontSize="small" className="listen-icon" />
    </IconButton>
  );
};

export default ListenToArticle;
