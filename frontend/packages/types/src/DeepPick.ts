import type { KeysOf } from "./KeysOf";

export type DeepPick<T, Path extends KeysOf<T>, NonNullT = Exclude<T, null>> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof NonNullT
    ? Rest extends KeysOf<NonNullT[Key]>
      ? DeepPick<NonNullT[Key], Rest>
      : never
    : never
  : Path extends keyof NonNullT
    ? Exclude<NonNullT[Path], null>
    : never;
