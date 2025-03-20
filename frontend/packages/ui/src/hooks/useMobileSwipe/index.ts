"use client";

import type { TouchEvent } from "react";
import { useState } from "react";

export type SwipeInput = {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
};

export type SwipeOutput = {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
};

export const useMobileSwipe = (input: SwipeInput): SwipeOutput => {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEndX(0); // otherwise the swipe is fired even with usual touch events
    setTouchEndY(0);
    if (!e.targetTouches[0]) {
      return;
    }

    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!e.targetTouches[0]) {
      return;
    }
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;

    // Horizontal Swipe
    const distanceX = touchStartX - touchEndX;
    const isLeftSwipe = distanceX > minSwipeDistance;

    // Vertical Swipe
    const distanceY = touchStartY - touchEndY;
    const isUpSwipe = distanceY > minSwipeDistance;

    if (Math.abs(touchStartX - touchEndX) > Math.abs(touchStartY - touchEndY)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isLeftSwipe ? input.onSwipedLeft?.() : input.onSwipedRight?.();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isUpSwipe ? input.onSwipedUp?.() : input.onSwipedDown?.();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export default useMobileSwipe;
