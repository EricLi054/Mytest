import type { EngineeredContentType } from "#components/EngineeredContent/types";
import type { PersonSchema } from "#graphql/person/queries/schema";
import type { EngineeredContentCollection } from "#types/EngineeredJourneyProps";
import type { z } from "zod";
import EngineeredContent from "#components/EngineeredContent";

import type { CustomCldImageProps } from "@racwa/ui";

const createEngineeredContentComponent = (
  contentType: EngineeredContentType,
  contentId: string,
  imageProps?: Partial<CustomCldImageProps>,
  person?: z.infer<typeof PersonSchema>,
) => {
  return (engineeredContent: EngineeredContentCollection) => {
    const Component = () => (
      <EngineeredContent
        contentType={contentType}
        data={engineeredContent.getById(contentId)}
        imageProps={imageProps}
        person={person}
      />
    );
    Component.displayName = contentId;
    return Component;
  };
};

export default createEngineeredContentComponent;
