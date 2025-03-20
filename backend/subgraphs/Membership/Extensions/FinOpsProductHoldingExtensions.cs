using Membership.Types.FinOps;

namespace Membership.Extensions;

public static class FinOpsProductHoldingExtensions
{
    public static void ProcessProductHoldings(this List<ProductHolding> listOfProductHoldings, List<string> validFinopsProducts)
    {
        var productHoldingsCopy = listOfProductHoldings.ToList();

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

            var productHoldingLines = productHolding.ProductHoldingLines.ToList();

            foreach (var productHoldingLine in productHoldingLines.ToList())
            {
                if (!validFinopsProducts.Contains(productHoldingLine.ProductId) || IsCancelled(productHoldingLine.CancelDate))
                {
                    productHoldingLines.Remove(productHoldingLine);
                }
            }

            productHolding.ProductHoldingLines = productHoldingLines;

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