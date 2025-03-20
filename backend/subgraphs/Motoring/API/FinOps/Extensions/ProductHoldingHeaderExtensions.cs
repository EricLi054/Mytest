using Motoring.API.FinOps.Models;
using Motoring.GraphQL.Types;

namespace Motoring.API.FinOps.Extensions;

public static class ProductHoldingHeaderExtensions
{
    public static RoadsideProduct ToRoadsideProduct(this ProductHoldingHeader header)
    {
        return new()
        {
            Id = header.ProductHoldingHeaderId,
            CustAccount = header.CustAccount,
            IsActive = header.Status == Constants.FinOps.ActiveStatus,
            Lines = header.ProductHoldingLines?.Select(line => line.ToRoadsideProductLine()).ToList()
        };
    }
}