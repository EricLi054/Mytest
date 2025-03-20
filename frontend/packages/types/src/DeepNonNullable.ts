export type DeepNonNullable<T> = Exclude<
  {
    [K in keyof T]: DeepNonNullable<NonNullable<T[K]>>;
  },
  null
>;
