using Motoring.API.Vehicle.Models;

namespace Motoring.API.Vehicle.Extensions;

public static class VehicleDetailExtensions
{
    public static GraphQL.Types.VehicleDetail ToGraphQLType(this VehicleDetail vehicleDetail, GraphQL.Enums.VehicleType vehicleType, string registrationNumber)
    {
        return new()
        {
            VehicleType = vehicleType,
            RegistrationNumber = registrationNumber,
            NVIC = vehicleDetail.NVIC,
            Year = vehicleDetail.Year,
            Make = vehicleDetail.Make,
            Model = vehicleDetail.Model,
            Variant = vehicleDetail.Variant,
            Series = vehicleDetail.Series,
            Body = vehicleDetail.Body,
            Color = vehicleDetail.Color,
            CC = vehicleDetail.CC,
            Transmission = vehicleDetail.Transmission,
            Engine = vehicleDetail.Engine,
            Cylinder = vehicleDetail.Cylinder,
            CO2Emission = vehicleDetail.CO2Emission,
            VIN = vehicleDetail.VIN,
            Fuel = vehicleDetail.Fuel,
            Height = vehicleDetail.Height,
            Length = vehicleDetail.Length,
            Width = vehicleDetail.Width,
            KerbWeight = vehicleDetail.KerbWeight
        };
    }
}