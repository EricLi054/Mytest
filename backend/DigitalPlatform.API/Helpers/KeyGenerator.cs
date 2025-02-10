
using DigitalPlatform.API.Descriptors;
using System.Security.Cryptography;
using System.Text;

namespace DigitalPlatform.API.Helpers;
public static class KeyGenerator
{
    /// <summary>
    /// Generates a cryptographic key using the provided password and salt.
    /// </summary>
    /// <param name="password">The password used for key generation.</param>
    /// <param name="salt">The salt used for key generation.</param>
    /// <returns>A DeriveBytes object initialized with the generated key.</returns>
    public static DeriveBytes Generate(string password, string salt) => 
        new Rfc2898DeriveBytes(password, Encoding.Default.GetBytes(salt), CryptographyDefaults.DefaultIterations, HashAlgorithmName.SHA512);
}