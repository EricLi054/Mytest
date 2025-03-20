using Motoring.API.FinOps.Models;
using Motoring.GraphQL.Enums;
using Motoring.GraphQL.Types;
using System.Text.RegularExpressions;

namespace Motoring.API.FinOps.Extensions;

public static partial class ProductHoldingLineExtensions
{
    public static RoadsideProductLine ToRoadsideProductLine(this ProductHoldingLine line)
    {
        return new()
        {
            Id = line.ProductHoldingId,
            Version = line.ProductHoldingVersion,
            ProductType = line.GetProductType(),
            CanUpdateVehicle = line.CanUpdateVehicle,
            CanUpdateVehicleReason = line.GetCanUpdateVehicleReason(),
            VehicleDetail = line.VehicleDetail?.ToGraphQLType()
        };
    }

    public static RoadsideProductType GetProductType(this ProductHoldingLine line)
    {
        return line.ProductId switch
        {
            "STD" => RoadsideProductType.Standard,
            "CLAS" => RoadsideProductType.Classic,
            "ULTI" => RoadsideProductType.Ultimate,
            "ULPL" => RoadsideProductType.UltimatePlus,
            "W2G" => RoadsideProductType.Wheels2Go,
            "F2GSTD" => RoadsideProductType.Free2GoStandard,
            "F2GCLAS" => RoadsideProductType.Free2GoClassic,
            "F2GULT" => RoadsideProductType.Free2GoUltimate,
            "F2GULTP" => RoadsideProductType.Free2GoUltimatePlus,
            "GLSTD" => RoadsideProductType.GoldLifeStandard,
            "GLCLAS" => RoadsideProductType.GoldLifeClassic,
            "GLULTI" => RoadsideProductType.GoldLifeUltimate,
            "GLULPL" => RoadsideProductType.GoldLifeUltimatePlus,
            "GLW2G" => RoadsideProductType.GoldLifeWheels2Go,
            "HLSTD" => RoadsideProductType.HonoraryLifeStandard,
            "HLCL" => RoadsideProductType.HonoraryLifeClassic,
            "HONSTULT" => RoadsideProductType.HonoraryStaffUltimate,
            "STULT" => RoadsideProductType.StaffUltimate,
            "CCULT" => RoadsideProductType.CountryContractorUltimate,
            "FORRNCO" => RoadsideProductType.FordNCORewards,
            "FREWDSR" => RoadsideProductType.FordDSRRewardsNCO,
            "FSTDCMO" => RoadsideProductType.FordCMOStandard,
            "FSTDDSR" => RoadsideProductType.FordDSRStandardMigrationOnly,
            "MSTDCMO" => RoadsideProductType.MitsubishiCMOStandard,
            "MSTDDSR" => RoadsideProductType.MitsubishiDSRStandard,
            "SSTDCMO" => RoadsideProductType.SubaruCMOStandard,
            "SSTDMY" => RoadsideProductType.SubaruMultiYearCMOStandard,
            "STIVES" => RoadsideProductType.StIves,
            _ => RoadsideProductType.Other,
        };
    }


    public static CanUpdateVehicleReason? GetCanUpdateVehicleReason(this ProductHoldingLine line)
    {
        var reason = line.CanUpdateVehicleReason?.Trim();

        return reason switch
        {
            null => null,
            "" => null,
            _ when reason == $"For product {line.ProductId}, rego can be changed but not the vehicle." => CanUpdateVehicleReason.RegoOnlyChangeAllowed,
            _ when reason == $"Product {line.ProductId} is not enabled for Vehicle association" => CanUpdateVehicleReason.ProductNotEnabled,
            _ when VehicleChangeLimitReachedRegex().IsMatch(reason) => CanUpdateVehicleReason.VehicleChangeLimitReached,
            _ => throw new ArgumentOutOfRangeException(nameof(reason), reason, $"Unknown CanUpdateVehicleReason [{line.CanUpdateVehicleReason}] for line [{line.ProductHoldingId}]")
        };
    }

    [GeneratedRegex(@"Vehicle change limit of \d+ reached\. No more vehicle change until renewal.")]
    private static partial Regex VehicleChangeLimitReachedRegex();
}