import type { ReactNode } from "react";

export type ComponentMapperType = Record<string, ({ id }: { id: string }) => ReactNode>;
export type EngineeredFormMapperType = Record<string, () => ReactNode>;
