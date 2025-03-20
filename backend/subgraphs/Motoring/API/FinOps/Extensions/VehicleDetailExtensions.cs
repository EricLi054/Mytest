using Motoring.API.FinOps.Models;

namespace Motoring.API.FinOps.Extensions;

public static class VehicleDetailExtensions
{
    public static GraphQL.Types.VehicleDetail ToGraphQLType(this VehicleDetail vehicleDetail)
    {
        return new()
        {
            VehicleType = vehicleDetail.Type switch
            {
                VehicleType.Vehicle => GraphQL.Enums.VehicleType.Car,
                VehicleType.Motorcycle => GraphQL.Enums.VehicleType.Motorcycle,
                _ => throw new ArgumentOutOfRangeException(nameof(vehicleDetail), vehicleDetail.Type, null)
            },
            RegistrationNumber = vehicleDetail.RegistrationNumber,
            NVIC = vehicleDetail.NVIC,
            Year = ParseInt(vehicleDetail.Year),
            Make = vehicleDetail.Make,
            Model = vehicleDetail.Model,
            Variant = vehicleDetail.Variant,
            Series = vehicleDetail.Series,
            Body = vehicleDetail.BodyType,
            Color = vehicleDetail.Color,
            CC = vehicleDetail.CC,
            Transmission = vehicleDetail.Transmission,
            Cylinder = vehicleDetail.Cylinder,
            CO2Emission = vehicleDetail.CO2Emission.ToString(),
            VIN = vehicleDetail.VIN,
            Fuel = vehicleDetail.FuelType,
            Height = vehicleDetail.Height,
            Length = vehicleDetail.Length,
            Width = vehicleDetail.Width,
            KerbWeight = vehicleDetail.KerbWeight
        };
    }

    public static VehicleDetail ToFinOpsModel(this GraphQL.Types.VehicleDetail vehicleDetail)
    {
        return new()
        {
            Type = vehicleDetail.VehicleType switch
            {
                GraphQL.Enums.VehicleType.Car => VehicleType.Vehicle,
                GraphQL.Enums.VehicleType.Motorcycle => VehicleType.Motorcycle,
                _ => throw new ArgumentOutOfRangeException(nameof(vehicleDetail), vehicleDetail.VehicleType, null)
            },
            RegistrationNumber = vehicleDetail.RegistrationNumber,
            NVIC = vehicleDetail.NVIC,
            Year = vehicleDetail.Year.ToString(),
            Make = vehicleDetail.Make,
            Model = vehicleDetail.Model,
            Variant = vehicleDetail.Variant,
            Series = vehicleDetail.Series,
            BodyType = vehicleDetail.Body,
            Color = vehicleDetail.Color,
            CC = vehicleDetail.CC,
            Transmission = vehicleDetail.Transmission,
            Cylinder = vehicleDetail.Cylinder,
            CO2Emission = ParseInt(vehicleDetail.CO2Emission),
            VIN = vehicleDetail.VIN,
            FuelType = vehicleDetail.Fuel,
            Height = vehicleDetail.Height,
            Length = vehicleDetail.Length,
            Width = vehicleDetail.Width,
            KerbWeight = vehicleDetail.KerbWeight
        };
    }

    private static int? ParseInt(string? value)
    {
        if (int.TryParse(value, out var result))
        {
            return result;
        }

        return null;
    }
}