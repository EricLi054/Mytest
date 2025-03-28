import { useEffect } from "react";

type ReCaptcha = {
  ready: (callback: () => Promise<void>) => Promise<void>;
  render: (htmlElement: string, options: { sitekey: string; badge: string; size: string }) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

const reCaptcha = (): ReCaptcha => {
  return window.grecaptcha as ReCaptcha;
};

export const getReCaptchaToken = async (reCaptchaSiteKey: string): Promise<string> => {
  try {
    return await reCaptcha().execute(reCaptchaSiteKey, { action: "MemberMatch" });
  } catch {
    return "";
  }
};

export type ReCaptchaProps = {
  reCaptchaSiteKey: string;
};

export default function ReCaptcha({ reCaptchaSiteKey }: ReCaptchaProps) {
  // Add script and styling for reCAPTCHA v3
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .grecaptcha-badge {
        visibility: hidden !important;
      }
    `;

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${reCaptchaSiteKey}`;
    script.defer = true;
    script.async = true;

    document.head.appendChild(style);
    document.head.appendChild(script);
  }, [reCaptchaSiteKey]);

  return <></>;
}
