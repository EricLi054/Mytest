namespace DigitalPlatform.API.Helpers.ProductMapping;

public class ProductMapperRepository(IEnumerable<IProductMapper> mappers, ILogger<ProductMapperRepository> logger) : IProductMapperRepository
{
    private readonly IEnumerable<IProductMapper> _mappers = mappers;

    private readonly ILogger<ProductMapperRepository> _logger = logger;

    public IProductMapper? Get(string type)
    {
        if (string.IsNullOrEmpty(type))
        {
            throw new ArgumentException("Type cannot be null or empty.", nameof(type));
        }

        foreach (var instance in _mappers)
        {
            if (instance.Type.Equals(type, StringComparison.OrdinalIgnoreCase)) return instance;
        }

        _logger.LogError($"No mapper found for type '{type}'");
        return null;
    }
}
