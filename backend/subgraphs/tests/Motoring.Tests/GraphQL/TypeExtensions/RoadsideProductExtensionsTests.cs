using Motoring.GraphQL.Enums;
using Motoring.GraphQL.TypeExtensions;
using Motoring.GraphQL.Types;

namespace Motoring.Tests.GraphQL.TypeExtensions;

public class RoadsideProductHoldingExtensionTests
{
    private RoadsideProductExtensions _roadsideProductExtensions = null!;

    [SetUp]
    public void SetUp()
    {
        _roadsideProductExtensions = new RoadsideProductExtensions();
    }

    [Test]
    public void GetProductHoldingLine_ShouldReturnCorrectLine_WhenLineExists()
    {
        const string lineId = "line123";
        var roadsideProduct = new RoadsideProduct
        {
            Id = "header123",
            CustAccount = "cust123",
            IsActive = true,
            Lines =
            [
                new()
                {
                    Id = lineId,
                    Version = 1,
                    ProductType = RoadsideProductType.Free2GoUltimate,
                    CanUpdateVehicle = true,
                },

                new()
                {
                    Id = "line456",
                    Version = 1,
                    ProductType = RoadsideProductType.Classic,
                    CanUpdateVehicle = true,
                }
            ]
        };

        var result = _roadsideProductExtensions.GetLine(roadsideProduct, lineId);

        Assert.That(result, Is.Not.Null);
        Assert.That(result?.Id, Is.EqualTo(lineId));
    }

    [Test]
    public void GetProductHoldingLine_ShouldReturnNull_WhenLineDoesNotExist()
    {
        const string lineId = "nonexistentLine";
        var roadsideProduct = new RoadsideProduct
        {
            Id = "header123",
            CustAccount = "cust123",
            IsActive = true,
            Lines =
            [
                new()
                {
                    Id = "line123",
                    Version = 1,
                    ProductType = RoadsideProductType.UltimatePlus,
                    CanUpdateVehicle = true,
                },

                new()
                {
                    Id = "line456",
                    Version = 1,
                    ProductType = RoadsideProductType.Wheels2Go,
                    CanUpdateVehicle = true,
                }
            ]
        };

        var result = _roadsideProductExtensions.GetLine(roadsideProduct, lineId);

        Assert.That(result, Is.Null);
    }

    [Test]
    public void GetProductHoldingLine_ShouldReturnNull_WhenProductHoldingLinesIsNull()
    {
        const string lineId = "line123";
        var roadsideProduct = new RoadsideProduct
        {
            Id = "header123",
            CustAccount = "cust123",
            IsActive = true,
            Lines = null
        };

        var result = _roadsideProductExtensions.GetLine(roadsideProduct, lineId);

        Assert.That(result, Is.Null);
    }
}