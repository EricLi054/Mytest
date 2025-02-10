namespace DigitalPlatform.API.Interfaces;
public interface ICustomAuthMiddleware
{
    Task Invoke(HttpContext context);
}