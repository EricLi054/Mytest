import { getDynamicsProduct } from "@racwa/automation";

type FindDynamicsProductParams = {
  productStatus: "Active" | "Inactive";
  productType: "Classic" | "Wheels2Go" | "Rewards";
};

export const findDynamicsProduct = async ({ productStatus, productType }: FindDynamicsProductParams) => {
  const result = await getDynamicsProduct({ productStatus, productType });

  if (!result.success) {
    console.log(result.error);
    throw new Error(`Failed to find ${productStatus} ${productType} product`);
  }

  return result.product;
}; 