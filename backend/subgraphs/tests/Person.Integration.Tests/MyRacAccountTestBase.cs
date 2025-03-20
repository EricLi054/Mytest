using Shared.Integration.Tests.Services;

namespace Person.Integration.Tests;
public class MyRacAccountTestBase
{
    protected string Email;
    protected string Password;

    [OneTimeSetUp]
    public async Task SetUp()
    {
        (Email, Password) = await DataService.GetAccountAsync();
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        if (!string.IsNullOrEmpty(Email))
        {
            await DataService.DeleteAccountAsync(Email);
        }
    }
}
