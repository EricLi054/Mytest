namespace DigitalPlatform.API.Interfaces
{
    public interface IHandlebarContextService
    {
        string LoginEmail { get; set; }
        Task<ContentContext> GetHandlebarContext(string content, string crmId = "", string sessionKey = "");
    }
}
