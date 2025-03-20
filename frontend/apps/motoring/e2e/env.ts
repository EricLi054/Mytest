import { z } from "zod";

import { automationEnvironment } from "@racwa/automation";

export const AUTOMATION_ENV = z.enum(automationEnvironment).parse(process.env.CONTAINER_APP_ENV?.trim());
