namespace DigitalPlatform.API.Interfaces
{
    public interface IContentService
    {
        Task<string> GetContentAsync(string query);
    }
}
