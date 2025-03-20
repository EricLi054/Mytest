"use client";

import type { z } from "zod";
import { useState } from "react";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";
import InternalRichTextRenderer from "#components/RichText/InternalRichTextRenderer";

import { RacwaOverhangNotification } from "@racwa/react-components";

import type { BannerAlertSchema } from "../schema";

const AlertBanner = ({ bannerAlert }: { bannerAlert: z.infer<typeof BannerAlertSchema> }) => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <RacwaOverhangNotification
      in={isVisible}
      onClose={() => {
        setIsVisible(false);
      }}
      icon={<FontAwesomeIcon icon={bannerAlert.icon} />}
      title={bannerAlert.title}
    >
      <InternalRichTextRenderer text={bannerAlert.bodyText} />
    </RacwaOverhangNotification>
  );
};

export default AlertBanner;
