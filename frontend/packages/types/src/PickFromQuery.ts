import type { DeepPick } from "./DeepPick";
import type { KeysOf } from "./KeysOf";

// `any` can be useful in generic helper types involving function arguments to allow more specific types to be inferred
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryFn = (...args: any[]) => Promise<{ data: unknown }>;

type QueryData<Q extends QueryFn> = Awaited<ReturnType<Q>>["data"];

/**
 * Extracts the type of a deeply nested field from a query
 *
 * @example
 * type VehicleDetail = PickFromQuery<typeof getRoadsideProductData, "me.roadsideProduct.line.vehicleDetail">;
 */
export type PickFromQuery<Q extends QueryFn, Path extends KeysOf<QueryData<Q>>> = DeepPick<QueryData<Q>, Path>;
