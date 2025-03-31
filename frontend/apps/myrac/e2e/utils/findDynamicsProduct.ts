import { Dynamics, DynamicsProductHoldingEntity, queryDynamics, secondsTaken } from "@racwa/automation";

type FindDynamicsProductArgs = {
  productStatus?: keyof typeof Dynamics.ProductStatus;
  productType?: keyof typeof Dynamics.ProductType;
};

const log = (message: string) => console.log(`[findDynamicsProduct]: ${message}`);

// 辅助函数：从对象的键中随机选择一个
function getRandomKey<T extends object>(obj: T): keyof T {
  const keys = Object.keys(obj) as Array<keyof T>;
  return keys[Math.floor(Math.random() * keys.length)];
}

export const findDynamicsProduct = async ({ 
  productStatus, 
  productType 
}: FindDynamicsProductArgs = {}) => {
  const start = performance.now();

  // 如果未提供，则随机选择状态和类型
  const selectedStatus = productStatus || getRandomKey(Dynamics.ProductStatus);
  const selectedType = productType || getRandomKey(Dynamics.ProductType);

  log(`Querying Dynamics for product type [${selectedType}] with status [${selectedStatus}]...`);

  const queryResult = await queryDynamics({
    entity: DynamicsProductHoldingEntity,
    query:
      `$filter=(statuscode eq ${Dynamics.ProductStatus[selectedStatus]} and contains(rac_name, '${Dynamics.ProductType[selectedType]}'))` +
      "&" +
      "$top=1",
  });

  if (!queryResult.success) {
    throw new Error("Dynamics query failed");
  }

  const { entities } = queryResult;

  const product = entities[0];

  if (!product) {
    throw new Error(`Failed to find product with status [${selectedStatus}] and type [${selectedType}]`);
  }

  log(
    `Found product [${product.rac_productholdingheaderid}]/[${product.rac_policynumber}] owned by [${product._rac_personid_value}]`,
  );

  log(`Took ${secondsTaken(start)}s`);

  return product;
};
