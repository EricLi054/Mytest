import type { PageContentItemSchema } from "#graphql/sharedSchema/pageSchema";
import type { z } from "zod";

export type ComponentSwitcherProps = {
  component: ContentItem;
};

export type ContentItem = z.infer<typeof PageContentItemSchema>;

export type ComponentSwitchableProps = {
  id: string;
};
