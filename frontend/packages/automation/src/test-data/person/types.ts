import type { z } from "zod";

import type { PersonSchema } from "./schemas";

export type Person = z.infer<typeof PersonSchema>;
