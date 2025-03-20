import type { z } from "zod";

import type { FinOpsProductHoldingHeaderSchema, FinOpsProductHoldingLineSchema } from "./schemas";

export type ProductHoldingHeader = z.infer<typeof FinOpsProductHoldingHeaderSchema>;
export type ProductHoldingLine = z.infer<typeof FinOpsProductHoldingLineSchema>;
