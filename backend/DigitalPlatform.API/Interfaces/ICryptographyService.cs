using System.Runtime.Serialization;
using DigitalPlatform.API.Models.Data;

namespace DigitalPlatform.API.Interfaces;
public interface ICryptographyService
{
    T Decrypt<T>(EncryptedData value) where T : class, new();

    EncryptedData Encrypt<T>(T value) where T : class, new();
    string GenerateSalt();
}