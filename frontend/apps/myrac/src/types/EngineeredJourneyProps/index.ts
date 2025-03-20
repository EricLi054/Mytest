import type { EngineeredContentSchema } from "#components/ComponentSwitcher/Placeholder/schema";
import type { z } from "zod";

export type EngineeredJourneyProps = {
  engineeredContent?: EngineeredContentCollection;
};

export type EngineeredContentProps = z.infer<typeof EngineeredContentSchema>;

export class EngineeredContentCollection extends Array<EngineeredContentProps> {
  getById(contentId: string) {
    if (!contentId) return undefined;
    return this.find((e) => e.contentId === contentId);
  }
}
