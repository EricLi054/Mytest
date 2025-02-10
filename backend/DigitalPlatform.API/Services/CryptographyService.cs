using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Helpers;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Data;

namespace DigitalPlatform.API.Services;

public class CryptographyService(IConfiguration configuration) : ICryptographyService
{
	private readonly string _key = configuration[SecretDescriptors.AES_KEY] ?? "";

	public T Decrypt<T>(EncryptedData value) where T : class, new()
	{
		if(value == null || value.EncryptedValue == null || string.IsNullOrEmpty(value.Salt))
		{
			throw new InvalidDataException(nameof(value));
		}
		using var algorithm = Algorithm(value.Salt);
		var result = Encoding.Default.GetString(Transform(Convert.FromBase64String(value.EncryptedValue), algorithm.CreateDecryptor()));
		var deserializedValue = JsonSerializer.Deserialize<T>(result) ?? throw new InvalidDataException(nameof(result));
        return deserializedValue;
	}

	public EncryptedData Encrypt<T>(T value) where T : class, new()
	{
		string salt = GenerateSalt();
		using var algorithm = Algorithm(salt);
		var serialisedValue = JsonSerializer.Serialize(value);
		var encrypted = Convert.ToBase64String(Transform(Encoding.Default.GetBytes(serialisedValue), algorithm.CreateEncryptor()));
		var result = new EncryptedData {EncryptedValue = encrypted, Salt = salt};
		return result; 
	}

	private static byte[] Transform(byte[] bytes, ICryptoTransform cryptoTransform)
	{
		using (cryptoTransform) { return cryptoTransform.TransformFinalBlock(bytes, 0, bytes.Length); }
	}

	private Aes Algorithm(string salt)
	{
		using var key = KeyGenerator.Generate(_key, salt);

		var algorithm = Aes.Create();

		algorithm.Key = key.GetBytes(algorithm.KeySize / 8);

		algorithm.IV = key.GetBytes(algorithm.BlockSize / 8);

		return algorithm;
	}

    public string GenerateSalt()
    {
		var saltLength = CryptographyDefaults.DefaultSaltLength;
        byte[] saltBytes = new byte[saltLength];

        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }

    	string salt = Convert.ToBase64String(saltBytes);
        return salt;
    }
}
