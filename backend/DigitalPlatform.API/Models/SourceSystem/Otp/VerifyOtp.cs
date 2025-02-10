using System.ComponentModel.DataAnnotations;

namespace DigitalPlatform.API.Models.SourceSystem.Otp
{
    public class VerifyOtpRequest
    {
        [Required(ErrorMessage = "Code is required")]
        public required string Code { get; set; }

        [Required(ErrorMessage = "Key is required")]
        public required string Key { get; set; }
    }

    public class VerifyOtpResponse
    {
        public bool IsVerified { get; set; }
    }
}
