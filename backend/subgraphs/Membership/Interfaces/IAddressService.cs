using Membership.Types.Address;

namespace Membership.Interfaces;

public interface IAddressService
{
    Task<AddressLookup?> GetPafAddressListAsync(string partialAddress);
    Task<PAFVerification?> GetPafAddressAsync(string moniker);
}