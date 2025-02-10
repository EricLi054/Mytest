using DigitalPlatform.API.Models.Products;
using DigitalPlatform.API.Models.Data.Person;

namespace DigitalPlatform.API.Interfaces
{
    public interface IProductService
    {
        Task<MemberProducts> GetProducts(string crmId, Person person);
        Task<MemberProducts> GetProducts(string crmId, string sessionKey);
    }
}
