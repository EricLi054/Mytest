import { type TouchEvent, useState } from 'react';

export interface SwipeInput {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
}

export interface SwipeOutput {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

const useSwipe = (input: SwipeInput): SwipeOutput => {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEndX(0); // otherwise the swipe is fired even with usual touch events
    setTouchEndY(0);

    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
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
      isLeftSwipe ? input.onSwipedLeft?.() : input.onSwipedRight?.();
    } else {
      isUpSwipe ? input.onSwipedUp?.() : input.onSwipedDown?.();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

export default useSwipe;
