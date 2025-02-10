using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Models.SourceSystem.MemberCards;

public record PhysicalCardRequest
{
    [Required(ErrorMessage = "MemberId is required")]
    public required string MemberId { get; set; }
}