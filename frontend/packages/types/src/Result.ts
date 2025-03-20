type ResultValue = { value?: unknown; error?: unknown };

type GetValue<T extends { value?: unknown }> = T["value"] extends object ? T["value"] : { value: T["value"] };
type GetError<T extends { error?: unknown }> = T["error"] extends object ? T["error"] : { error: T["error"] };

/**
 * @example
 * type Basic = Result;
 * // { success: true } | { success: false }
 *
 * type PrimitiveValue = Result<{ value: "✅" }>;
 * // { success: true, value: "✅" } | { success: false }
 *
 * type ObjectValue = Result<{ value: { custom: "🐒" } }>;
 * // { success: true, custom: "🐒" } | { success: false }
 *
 * type PrimitiveError = Result<{ error: "🚭" }>;
 * // { success: true } | { success: false, error: "🚭" }
 *
 * type ObjectError = Result<{ error: { custom: "🥜" } }>;
 * // { success: true } | { success: false, custom: "🥜" }
 *
 * type ValueAndError = Result<{ value: "✅", error: { custom: "🥜" } }>;
 * // { success: true, value: "✅" } | { success: false, custom: "🥜" }
 *
 * type InvalidKeys = Result<{ value: "✅", err: "🥜", lol: "😹" }>;
 * // "Invalid key passed to Result type: err" | "Invalid key passed to Result type: lol"
 */
export type Result<T extends ResultValue = never> = Readonly<
  [T] extends [never]
    ? { success: true } | { success: false }
    : keyof T extends keyof ResultValue
      ? "value" extends keyof T
        ? "error" extends keyof T
          ? ({ success: true } & GetValue<T>) | ({ success: false } & GetError<T>)
          : ({ success: true } & GetValue<T>) | { success: false }
        : "error" extends keyof T
          ? { success: true } | ({ success: false } & GetError<T>)
          : never
      : `Invalid key passed to Result type: ${Extract<Exclude<keyof T, keyof ResultValue>, string>}`
>;
