import type { CreateSessionArgs } from "./session/actions";
import CreateSession from "./session/CreateSession";

type SearchParams = Promise<CreateSessionArgs>;

export default async function UpdateYourVehicle({ searchParams }: { searchParams: SearchParams }) {
  const { productHoldingHeaderId, productHoldingLineId } = await searchParams;

  return <CreateSession productHoldingHeaderId={productHoldingHeaderId} productHoldingLineId={productHoldingLineId} />;
}
