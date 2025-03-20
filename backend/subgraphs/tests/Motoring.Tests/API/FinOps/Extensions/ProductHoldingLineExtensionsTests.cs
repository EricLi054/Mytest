using Motoring.API.FinOps.Extensions;
using Motoring.API.FinOps.Models;
using Motoring.GraphQL.Enums;

namespace Motoring.Tests.API.FinOps.Extensions;

[TestFixture]
public class ProductHoldingLineExtensionsTests
{
    [Test]
    public void ToRoadsideProductLine_ShouldMap()
    {
        var productId = "CLAS";
        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = productId,
            CanUpdateVehicle = false,
            CanUpdateVehicleReason = $"For product {productId}, rego can be changed but not the vehicle.",
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

        var result = line.ToRoadsideProductLine();

        Assert.Multiple(() =>
        {
            Assert.That(result.Id, Is.EqualTo(line.ProductHoldingId));
            Assert.That(result.Version, Is.EqualTo(line.ProductHoldingVersion));
            Assert.That(result.ProductType, Is.TypeOf<RoadsideProductType>());
            Assert.That(result.CanUpdateVehicle, Is.EqualTo(line.CanUpdateVehicle));
            Assert.That(result.CanUpdateVehicleReason, Is.EqualTo(CanUpdateVehicleReason.RegoOnlyChangeAllowed));
            Assert.That(result.VehicleDetail, Is.TypeOf<Motoring.GraphQL.Types.VehicleDetail>());
        });
    }

    [Test]
    public void ToRoadsideProductLine_ShouldMapNullVehicleDetail_ToNull()
    {
        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = "CLAS",
            CanUpdateVehicle = true,
            VehicleDetail = null
        };

        var result = line.ToRoadsideProductLine();

        Assert.That(result.VehicleDetail, Is.Null);
    }

    [TestCase("STD", RoadsideProductType.Standard)]
    [TestCase("CLAS", RoadsideProductType.Classic)]
    [TestCase("ULTI", RoadsideProductType.Ultimate)]
    [TestCase("ULPL", RoadsideProductType.UltimatePlus)]
    [TestCase("W2G", RoadsideProductType.Wheels2Go)]
    [TestCase("F2GSTD", RoadsideProductType.Free2GoStandard)]
    [TestCase("F2GCLAS", RoadsideProductType.Free2GoClassic)]
    [TestCase("F2GULT", RoadsideProductType.Free2GoUltimate)]
    [TestCase("F2GULTP", RoadsideProductType.Free2GoUltimatePlus)]
    [TestCase("GLSTD", RoadsideProductType.GoldLifeStandard)]
    [TestCase("GLCLAS", RoadsideProductType.GoldLifeClassic)]
    [TestCase("GLULTI", RoadsideProductType.GoldLifeUltimate)]
    [TestCase("GLULPL", RoadsideProductType.GoldLifeUltimatePlus)]
    [TestCase("GLW2G", RoadsideProductType.GoldLifeWheels2Go)]
    [TestCase("HLSTD", RoadsideProductType.HonoraryLifeStandard)]
    [TestCase("HLCL", RoadsideProductType.HonoraryLifeClassic)]
    [TestCase("HONSTULT", RoadsideProductType.HonoraryStaffUltimate)]
    [TestCase("STULT", RoadsideProductType.StaffUltimate)]
    [TestCase("CCULT", RoadsideProductType.CountryContractorUltimate)]
    [TestCase("FORRNCO", RoadsideProductType.FordNCORewards)]
    [TestCase("FREWDSR", RoadsideProductType.FordDSRRewardsNCO)]
    [TestCase("FSTDCMO", RoadsideProductType.FordCMOStandard)]
    [TestCase("FSTDDSR", RoadsideProductType.FordDSRStandardMigrationOnly)]
    [TestCase("MSTDCMO", RoadsideProductType.MitsubishiCMOStandard)]
    [TestCase("MSTDDSR", RoadsideProductType.MitsubishiDSRStandard)]
    [TestCase("SSTDCMO", RoadsideProductType.SubaruCMOStandard)]
    [TestCase("SSTDMY", RoadsideProductType.SubaruMultiYearCMOStandard)]
    [TestCase("STIVES", RoadsideProductType.StIves)]
    [TestCase("UNKNOWN_ID", RoadsideProductType.Other)]
    public void GetProductType_ShouldReturnCorrectType(string productId, RoadsideProductType expectedType)
    {
        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = productId,
            CanUpdateVehicle = true,
        };

        var result = line.GetProductType();

        Assert.That(result, Is.EqualTo(expectedType));
    }

    [TestCase(null)]
    [TestCase("")]
    public void GetCanUpdateVehicleReason_ShouldMapMissingReason_ToNull(string? reason)
    {
        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = "CLAS",
            CanUpdateVehicle = true,
            CanUpdateVehicleReason = reason
        };

        var result = line.GetCanUpdateVehicleReason();

        Assert.That(result, Is.Null);
    }

    [Test]
    public void GetCanUpdateVehicleReason_ShouldMapRegoChangeReason_ToRegoOnlyChangeAllowed()
    {
        var productId = "CLAS";

        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = productId,
            CanUpdateVehicle = false,
            CanUpdateVehicleReason = $"For product {productId}, rego can be changed but not the vehicle."
        };

        var result = line.GetCanUpdateVehicleReason();

        Assert.That(result, Is.EqualTo(CanUpdateVehicleReason.RegoOnlyChangeAllowed));
    }

    [TestCase(1)]
    [TestCase(10)]
    [TestCase(100)]
    public void GetCanUpdateVehicleReason_ShouldMapVehicleChangeLimitReason_ToVehicleChangeLimitReached(int limit)
    {
        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = "CLAS",
            CanUpdateVehicle = false,
            CanUpdateVehicleReason = $"Vehicle change limit of {limit} reached. No more vehicle change until renewal."
        };

        var result = line.GetCanUpdateVehicleReason();

        Assert.That(result, Is.EqualTo(CanUpdateVehicleReason.VehicleChangeLimitReached));
    }

    [Test]
    public void GetCanUpdateVehicleReason_ShouldThrow_WhenVehicleChangeLimitReasonHasInvalidLimit()
    {
        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = "CLAS",
            CanUpdateVehicle = false,
            CanUpdateVehicleReason = $"Vehicle change limit of INVALID reached. No more vehicle change until renewal."
        };

        Assert.Throws<ArgumentOutOfRangeException>(() => line.GetCanUpdateVehicleReason());
    }

    [Test]
    public void GetCanUpdateVehicleReason_ShouldMapProductNotEnabledReason_ToProductNotEnabled()
    {
        var productId = "CLAS";

        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = productId,
            CanUpdateVehicle = false,
            CanUpdateVehicleReason = $"Product {productId} is not enabled for Vehicle association"
        };

        var result = line.GetCanUpdateVehicleReason();

        Assert.That(result, Is.EqualTo(CanUpdateVehicleReason.ProductNotEnabled));
    }

    [Test]
    public void GetCanUpdateVehicleReason_ShouldThrow_WhenReasonIsUnknown()
    {
        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = "CLAS",
            CanUpdateVehicle = false,
            CanUpdateVehicleReason = "Unknown reason"
        };

        Assert.Throws<ArgumentOutOfRangeException>(() => line.GetCanUpdateVehicleReason());
    }

    [Test]
    public void GetCanUpdateVehicleReason_ShouldThrow_WhenProductIdDoesNotMatchReason()
    {
        var productId = "CLAS";

        var line = new ProductHoldingLine()
        {
            ProductHoldingId = "RSA123",
            ProductHoldingVersion = 1,
            ProductId = productId,
            CanUpdateVehicle = false,
            CanUpdateVehicleReason = $"Product ULTI is not enabled for Vehicle association"
        };

        Assert.Throws<ArgumentOutOfRangeException>(() => line.GetCanUpdateVehicleReason());
    }
}