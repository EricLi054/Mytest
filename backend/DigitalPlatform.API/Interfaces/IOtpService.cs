using DigitalPlatform.API.Models.SourceSystem.Otp;

namespace DigitalPlatform.API.Interfaces
{

    public interface IOtpService
    {
        Task<SendOtpResponse> SendOtpAsync(SendOtpRequest request);
        Task<VerifyOtpResponse> VerifyOtpAsync(VerifyOtpRequest request);
        Task<CheckOtpQueryResponse> CheckOtpAsync(CheckOtpRequest request);
    }
}
