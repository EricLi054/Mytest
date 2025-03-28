import type { CreateSessionArgs } from "./actions";
import CreateSession from "./CreateSession";

type SearchParams = Promise<CreateSessionArgs>;

export default async function UpdateYourVehicle({ searchParams }: { searchParams: SearchParams }) {
  const { productHoldingHeaderId, productHoldingLineId } = await searchParams;

  return <CreateSession productHoldingHeaderId={productHoldingHeaderId} productHoldingLineId={productHoldingLineId} />;
}
