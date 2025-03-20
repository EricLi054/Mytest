using Motoring.GraphQL.Types;

namespace Motoring.GraphQL.TypeExtensions;

[ExtendObjectType(typeof(RoadsideProduct))]
public sealed class RoadsideProductExtensions
{
    public RoadsideProductLine? GetLine([Parent] RoadsideProduct product, string id)
    {
        return product.Lines?.FirstOrDefault(line => line.Id == id);
    }
}

