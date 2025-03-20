import type { Entry } from "./richTextEntry";

export type Links = {
  entries: {
    inline: Entry[];
    block: Entry[];
  };
};
