namespace Membership.Types.MemberCards;

public record DigitalCardDetails
{
    public required string Id { get; set; }

    public string? DigitalCardPassId { get; set; }

    public string? DigitalCardPassUrl { get; set; }

    public bool DigitalCardPassIsActive { get; set; }

    public int NumberOfPassesInstalled { get; set; }
}

public record DigitalCardDetailsResponse
{
    public required bool IsSuccess { get; set; }

    public List<string>? Errors { get; set; }

    public DigitalCardDetails? Value { get; set; }
}