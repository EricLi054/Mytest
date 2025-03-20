import type { DeepNonNullable } from "./DeepNonNullable";

export type KeysOf<
  T,
  Path extends string = never,
  NonNullT = DeepNonNullable<T>,
  K extends keyof NonNullT = keyof NonNullT,
> = NonNullT extends object
  ? K extends string
    ? Path | KeysOf<NonNullT[K], [Path] extends [never] ? K : `${Path}.${K}`>
    : never
  : Path;
