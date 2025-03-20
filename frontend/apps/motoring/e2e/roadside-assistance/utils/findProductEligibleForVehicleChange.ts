import type { Person, ProductHoldingHeader, ProductHoldingLine } from "@racwa/automation";
import type { Result } from "@racwa/types";
import {
  Dynamics,
  DynamicsProductHoldingEntity,
  getPerson,
  getProductHoldingHeader,
  isPersonLinked,
  queryDynamics,
  randomShuffle,
  randomSlice,
  secondsTaken,
} from "@racwa/automation";

const SEARCH_LIMIT = 10;

const log = (message: string) => console.log(`[findProductEligibleForVehicleChange]: ${message}`);

export const findProductEligibleForVehicleChange = async (): Promise<
  Result<{
    value: {
      owner: Person;
      productHoldingHeader: ProductHoldingHeader;
      productHoldingLine: ProductHoldingLine;
    };
  }>
> => {
  const start = performance.now();

  // Products can only change vehicle once a year, use one of many product types to increase pool of available products
  const productType = Math.random() > 0.5 ? Dynamics.ProductType.Standard : Dynamics.ProductType.Classic;
  const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();

  const schema = DynamicsProductHoldingEntity.schema.pick({
    _rac_personid_value: true,
    rac_policynumber: true,
    rac_productholdingheaderid: true,
  });

  // 'modifiedon gt oneYearAgo' - avoid finding old versions of products (the status still comes back as Active)
  // 'orderby=modifiedon asc' - choose the least recently updated products to avoid ones that have already had a vehicle change
  const query = [
    `$select=${Object.keys(schema.shape).join(", ")}`,
    `$filter=(statuscode eq ${Dynamics.ProductStatus.Active} and contains(rac_name, '${productType}') and modifiedon gt ${oneYearAgo})`,
    "$orderby=modifiedon asc",
    `$top=${SEARCH_LIMIT * 10}`,
  ].join("&");

  log(`Querying Dynamics for product type [${productType}] with status [Active]...`);
  log(`query: [${query}]`);

  const queryResult = await queryDynamics({
    entity: { name: DynamicsProductHoldingEntity.name, schema },
    query,
  });

  if (!queryResult.success) {
    log("Dynamics query failed");
    return { success: false };
  }

  const { entities } = queryResult;

  log(`Found ${entities.length} roadside products`);
  log("Searching for eligible roadside product...");

  const randomProducts = randomShuffle(randomSlice(entities, SEARCH_LIMIT));

  for (const [i, product] of randomProducts.entries()) {
    const {
      _rac_personid_value: crmId,
      rac_productholdingheaderid: productHoldingHeaderId,
      rac_policynumber: productHoldingLineId,
    } = product;

    const productIds = `${productHoldingHeaderId}/${productHoldingLineId}`;

    log(`Attempt ${i + 1}/${randomProducts.length}: Product [${productIds}], Owner [${crmId}]`);

    const isPersonLinkedResult = await isPersonLinked({ crmId });

    if (!isPersonLinkedResult.success) {
      log(`Failed to check if owner [${crmId}] is already linked`);
      console.log(isPersonLinkedResult.error);
      return { success: false };
    }

    if (isPersonLinkedResult.isLinked) {
      log(`Owner [${crmId}] for product [${productIds}] is already linked to a myRAC account`);
      continue;
    }

    const ownerResult = await getPerson({ crmId });

    if (!ownerResult.success) {
      log(`Failed to get owner [${crmId}] for product [${productIds}]`);
      console.log(ownerResult.error);
      return { success: false };
    }

    const productHoldingHeaderResult = await getProductHoldingHeader({ id: productHoldingHeaderId });

    if (!productHoldingHeaderResult.success) {
      log(`Failed to get product holding header [${productHoldingHeaderId}]`);
      console.log(productHoldingHeaderResult.error);
      return { success: false };
    }

    if (productHoldingHeaderResult.Status !== "Active") {
      log(`Product holding header [${productHoldingHeaderId}] is not Active`);
      continue;
    }

    const productHoldingLine = productHoldingHeaderResult.ProductHoldingLines.find(
      (line) => line.ProductHoldingId === productHoldingLineId,
    );

    if (!productHoldingLine) {
      log(
        `Product holding line [${productHoldingLineId}] missing from product holding header [${productHoldingHeaderId}]`,
      );
      continue;
    }

    if (!productHoldingLine.CanUpdateVehicle) {
      log(`CanUpdateVehicle [false] for product holding line [${productHoldingLineId}]`);
      continue;
    }

    log(`Found eligible roadside product [${productIds}] owned by [${crmId}]`);
    log(`Took ${secondsTaken(start)}s`);

    return { success: true, owner: ownerResult, productHoldingHeader: productHoldingHeaderResult, productHoldingLine };
  }

  log("Failed to to find an eligible roadside product");
  log(`Took ${secondsTaken(start)}s`);

  return { success: false };
};
