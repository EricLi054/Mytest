using DigitalPlatform.API.Models.SourceSystem.FinOps;

namespace DigitalPlatform.API.Extensions
{
    public static class FinOpsProductHoldingExtensions
    {
        public static void ProcessProductHoldings(this List<FinOpsProductHolding> listOfProductHoldings, List<string> validFinopsProducts)
        {
            // Create a copy of the list to avoid modifying the collection while iterating
            var productHoldingsCopy = listOfProductHoldings.ToList();

            // Loop through each product holding within the copied list
            foreach (var productHolding in productHoldingsCopy)
            {
                if (productHolding.ProductHoldingLines == null || !productHolding.ProductHoldingLines.Any())
                {
                    continue;
                }

                if (productHolding.Status != ProductHoldingStatus.Active)
                {
                    listOfProductHoldings.Remove(productHolding);
                    continue;
                }

                // Convert ProductHoldingLines to a list to enable item removal
                var productHoldingLines = productHolding.ProductHoldingLines.ToList();

                foreach (var productHoldingLine in productHoldingLines.ToList())
                {
                    // Remove product holdings that are not in the valid list of products, or are not active, or have been cancelled
                    if (!validFinopsProducts.Contains(productHoldingLine.ProductId) || IsCancelled(productHoldingLine.CancelDate))
                    {
                        productHoldingLines.Remove(productHoldingLine);
                    }
                }

                // Update the ProductHoldingLines with the modified list
                productHolding.ProductHoldingLines = productHoldingLines;

                // If all lines are removed, remove the product holding
                if (!productHolding.ProductHoldingLines.Any())
                {
                    listOfProductHoldings.Remove(productHolding);
                }
            }
        }

        private static bool IsCancelled(DateTime? cancelDate)
        {
            return cancelDate != new DateTime(1900, 1, 1, 12, 0, 0) && DateTime.Today >= cancelDate;
        }
    }
}