using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Models.SourceSystem.Otp;

public record CheckOtpRequest
{
    [Required(ErrorMessage = "Key is required")]
    public required string Key { get; set; }

    [Required(ErrorMessage = "CrmId is required")]
    public required string CrmId { get; set; }
}

public record CheckOtpQuery
{
    [Required(ErrorMessage = "Key is required")]
    public required string Key { get; set; }
}

public record CheckOtpQueryResponse
{
    public bool IsVerified { get; set; }
}

public record CheckOtpResponse { }
