import type { Document } from "@contentful/rich-text-types";
import type { NotificationCardSchema } from "#contentful/schema";
import type { z } from "zod";

import { RacwaCardNotification } from "@racwa/react-components";

import RichTextRenderer from "../RichTextRenderer";

type RacwaCardNotificationProps = React.ComponentProps<typeof RacwaCardNotification>;
type ContentfulNotificationCardSchema = z.infer<typeof NotificationCardSchema>;

type ContentfulNotificationCardProps = ContentfulNotificationCardSchema &
  Omit<RacwaCardNotificationProps, keyof ContentfulNotificationCardSchema>;

export const ContentfulNotificationCard = ({ title, severity, content, ...props }: ContentfulNotificationCardProps) => {
  return (
    <RacwaCardNotification title={title} severity={severity as RacwaCardNotificationProps["severity"]} {...props}>
      <RichTextRenderer json={content.json as Document} />
    </RacwaCardNotification>
  );
};

export default ContentfulNotificationCard;
