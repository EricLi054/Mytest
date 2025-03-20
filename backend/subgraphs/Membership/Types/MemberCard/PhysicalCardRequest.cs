using System.ComponentModel.DataAnnotations;

namespace Membership.Types.MemberCards;

public record PhysicalCardRequest
{
    [Required(ErrorMessage = "MemberId is required")]
    public required string MemberId { get; set; }
}