namespace Membership.GraphQL.Types;

public record DigitalCardDetails
{
    public required string Id { get; set; }

    public string? PassId { get; set; }

    public string? PassUrl { get; set; }

    public bool IsActive { get; set; }

    public int NumberOfPassesInstalled { get; set; }
}