using DigitalPlatform.API.Models.SourceSystem.Address;

namespace DigitalPlatform.API.Interfaces
{
    public interface IAddressService
    {
        Task<AddressLookup> GetGnafAddressListAsync(string partialAddress);
        Task<AddressLookup> GetPafAddressListAsync(string partialAddress);
        Task<PAFVerification> GetPafAddressAsync(string moniker);
    }
}
