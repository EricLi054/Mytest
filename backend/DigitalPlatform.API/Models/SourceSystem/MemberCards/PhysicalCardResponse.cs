namespace DigitalPlatform.API.Models.SourceSystem.MemberCards;

public record PhysicalCardResponse
{
    public required bool IsSuccess { get; set; }

    public List<string>? Errors { get; set; }

    public string? Value { get; set; }
}