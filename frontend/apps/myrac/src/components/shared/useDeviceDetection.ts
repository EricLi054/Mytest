import { useEffect, useState } from "react";

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isApple, setIsApple] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  const detectDevice = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator) return;

    const userAgent = navigator.userAgent.toLocaleLowerCase();
    const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

    setIsMobile(isMobile);
    setIsTablet(isTablet);
    setIsDesktop(!isMobile && !isTablet);

    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
      setIsApple(false);
    } else if (/ipad|iphone|ipod/.test(userAgent) && !window.MSStream) {
      setIsApple(true);
      setIsAndroid(false);
    }
  };

  useEffect(() => {
    detectDevice();
    window.addEventListener("resize", detectDevice);

    return () => {
      window.removeEventListener("resize", detectDevice);
    };
  }, []);

  return {
    isMobile,
    isDesktop,
    isTablet,
    isApple,
    isAndroid,
  };
};
