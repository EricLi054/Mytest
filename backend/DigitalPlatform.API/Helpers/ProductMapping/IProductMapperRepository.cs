namespace DigitalPlatform.API.Helpers.ProductMapping;

public interface IProductMapperRepository
{
    public IProductMapper? Get(string type);
}