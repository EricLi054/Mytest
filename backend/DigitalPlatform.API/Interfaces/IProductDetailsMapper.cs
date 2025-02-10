using DigitalPlatform.API.Models.Data.Products.PolicyDetails;
using DigitalPlatform.API.Models.Products;

namespace DigitalPlatform.API.Interfaces;

public interface IPolicyDetailsMapper
{
    List<PolicyDetail> Map(MemberProducts memberProducts);
}