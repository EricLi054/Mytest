import { Dynamics, DynamicsProductHoldingEntity, queryDynamics, secondsTaken } from "@racwa/automation";

type FindDynamicsProductArgs = {
  productStatus: keyof typeof Dynamics.ProductStatus;
  productType: keyof typeof Dynamics.ProductType;
};

const log = (message: string) => console.log(`[findDynamicsProduct]: ${message}`);

export const findDynamicsProduct = async ({ productStatus, productType }: FindDynamicsProductArgs) => {
  const start = performance.now();

  log(`Querying Dynamics for product type [${productType}] with status [${productStatus}]...`);

  const queryResult = await queryDynamics({
    entity: DynamicsProductHoldingEntity,
    query:
      `$filter=(statuscode eq ${Dynamics.ProductStatus[`${productStatus}`]} and contains(rac_name, '${Dynamics.ProductType[`${productType}`]}'))` +
      "&" +
      "$top=1",
  });

  if (!queryResult.success) {
    throw new Error("Dynamics query failed");
  }

  const { entities } = queryResult;

  const product = entities[0];

  if (!product) {
    throw new Error("Failed to find product");
  }

  log(
    `Found product [${product.rac_productholdingheaderid}]/[${product.rac_policynumber}] owned by [${product._rac_personid_value}]`,
  );

  log(`Took ${secondsTaken(start)}s`);

  return product;
};
