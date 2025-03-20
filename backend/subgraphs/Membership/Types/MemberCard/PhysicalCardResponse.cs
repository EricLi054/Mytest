namespace Membership.Types.MemberCards;

public record PhysicalCardResponse
{
    public required bool IsSuccess { get; set; }
    public string? Value { get; set; }
}