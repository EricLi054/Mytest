using Motoring.API.FinOps.Extensions;
using Motoring.API.FinOps.Models;
using Motoring.GraphQL.Types;

namespace Motoring.Tests.API.FinOps.Extensions;

[TestFixture]
public class ProductHoldingHeaderExtensionsTests
{
    private static readonly ProductHoldingLine line = new()
    {
        ProductHoldingId = "RSA123",
        ProductHoldingVersion = 1,
        ProductId = "CLAS",
        CanUpdateVehicle = true,
        VehicleDetail = new()
        {
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020.ToString(),
            RegistrationNumber = "MU5TB3N1C3",
            Color = "Blue",
            BodyType = "Sedan",
            FuelType = "Petrol"
        }
    };

    [Test]
    public void ToRoadsideProduct_ShouldMap()
    {
        var productHoldingHeader = new ProductHoldingHeader
        {
            ProductHoldingHeaderId = "PHH123",
            CustAccount = "rac123",
            Status = Constants.FinOps.ActiveStatus,
            ProductHoldingLines = [line]
        };

        var result = productHoldingHeader.ToRoadsideProduct();

        Assert.Multiple(() =>
        {
            Assert.That(result.Id, Is.EqualTo(productHoldingHeader.ProductHoldingHeaderId));
            Assert.That(result.CustAccount, Is.EqualTo(productHoldingHeader.CustAccount));
            Assert.That(result.IsActive, Is.True);
            Assert.That(result.Lines, Has.All.TypeOf<RoadsideProductLine>());
        });
    }

    [Test]
    public void ToRoadsideProduct_ShouldMapActiveStatus_ToIsActiveTrue()
    {
        var productHoldingHeader = new ProductHoldingHeader
        {
            ProductHoldingHeaderId = "PHH123",
            CustAccount = "rac123",
            Status = Constants.FinOps.ActiveStatus,
            ProductHoldingLines = [line]
        };

        var result = productHoldingHeader.ToRoadsideProduct();

        Assert.That(result.IsActive, Is.True);
    }

    [Test]
    public void ToRoadsideProduct_ShouldMapNonActiveStatus_ToIsActiveFalse()
    {
        var productHoldingHeader = new ProductHoldingHeader
        {
            ProductHoldingHeaderId = "PHH123",
            CustAccount = "rac123",
            Status = "Not Active...",
            ProductHoldingLines = [line]
        };

        var result = productHoldingHeader.ToRoadsideProduct();

        Assert.That(result.IsActive, Is.False);
    }
}