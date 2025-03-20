namespace Motoring.GraphQL.Enums;

public enum CanUpdateVehicleReason
{
    VehicleChangeLimitReached, // Vehicle change limit of 1 reached. No more vehicle change until renewal.
    RegoOnlyChangeAllowed, // For product {ProductId}, rego can be changed but not the vehicle.
    ProductNotEnabled // Product {ProductId} is not enabled for Vehicle association
}