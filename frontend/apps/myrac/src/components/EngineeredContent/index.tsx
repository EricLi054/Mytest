import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import type { PersonSchema } from "#graphql/person/queries/schema";
import type { EngineeredContentProps } from "#types/EngineeredJourneyProps";
import type { z } from "zod";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";

import type { CustomCldImageProps } from "@racwa/ui";

import type { EngineeredContentType } from "./types";
import GACldImage from "../GACldImage";
import InternalRichTextRenderer from "../RichText/InternalRichTextRenderer";

const applyPersonValues = (data: EngineeredContentProps, person?: z.infer<typeof PersonSchema>) => {
  if (!person) {
    return data;
  }
  const dataString = JSON.stringify(data).replaceAll("{{person.FirstName}}", person.firstName);
  return JSON.parse(dataString) as EngineeredContentProps;
};

const EngineeredContent = ({
  data,
  iconProps,
  imageProps,
  contentType = "string",
  person,
}: {
  data?: EngineeredContentProps;
  iconProps?: Partial<FontAwesomeIconProps>;
  imageProps?: Partial<CustomCldImageProps>;
  contentType?: EngineeredContentType;
  person?: z.infer<typeof PersonSchema>;
}) => {
  try {
    if (!data) return null;

    const dataWithValues = applyPersonValues(data, person);

    switch (contentType) {
      case "richText":
        return dataWithValues.richTextContent ? (
          <InternalRichTextRenderer text={dataWithValues.richTextContent} />
        ) : null;
      case "image":
        return data.imageContent ? (
          <GACldImage
            alt={data.imageContent[0]?.secureUrl ?? ""}
            {...imageProps}
            src={data.imageContent[0]?.secureUrl ?? ""}
            fill
          />
        ) : null;
      case "icon":
        return data.iconContent ? <FontAwesomeIcon {...iconProps} icon={data.iconContent as IconProp} /> : null;
      case "string":
      default:
        return dataWithValues.stringContent;
    }
  } catch (error) {
    console.error("Error: EngineeredContent.tsx -", error);
    // Handle the error here
    return null;
  }
};

export default EngineeredContent;
