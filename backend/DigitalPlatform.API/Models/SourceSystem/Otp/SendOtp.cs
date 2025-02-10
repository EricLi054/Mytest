using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Models.SourceSystem.Otp;

public class SendOtpRequest
{
    [Required(ErrorMessage = "Channel is required")]
    public OtpChannel Channel { get; set; }

    [Required(ErrorMessage = "Key is required")]
    public required string Key { get; set; }
}

public class SendOtpResponse
{
    public bool HasSendAttemptsRemaining { get; set; }
}
