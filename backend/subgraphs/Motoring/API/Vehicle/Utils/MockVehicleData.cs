using System.Text.Json;
using System.Text.Json.Serialization;
using Motoring.API.Vehicle.Models;
using Motoring.API.Vehicle.Enums;
using Motoring.GraphQL.Enums;

namespace Motoring.Utils;

public class MockVehicleDetail
{
    public required VehicleDetail VehicleDetail { get; set; }
    public required string RegistrationNumber { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required ModelTypeCode ModelTypeCode { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required State State { get; set; }
}

public class MockVehicleData
{
    private static Dictionary<(ModelTypeCode, string, State), VehicleDetail> _vehicleDictionary = [];

    static MockVehicleData()
    {
        LoadMockData();
    }

    public static void LoadMockData(string? jsonData = null)
    {
        if (jsonData == null)
        {
            var jsonFilePath = Constants.Vehicle.MockVehiclePath;
            if (File.Exists(jsonFilePath))
            {
                jsonData = File.ReadAllText(jsonFilePath);
            }
            else
            {
                _vehicleDictionary = new Dictionary<(ModelTypeCode, string, State), VehicleDetail>();
                return;
            }
        }

        var options = new JsonSerializerOptions
        {
            Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
        };

        var mockVehicles = JsonSerializer.Deserialize<List<MockVehicleDetail>>(jsonData, options)
                           ?? [];

        _vehicleDictionary = mockVehicles.ToDictionary(
            v => (v.ModelTypeCode, v.RegistrationNumber ?? string.Empty, v.State),
            v => v.VehicleDetail
        );
    }

    public static VehicleDetail? GetMockVehicle(ModelTypeCode modelTypeCode, string rego, State state)
    {
        _vehicleDictionary.TryGetValue((modelTypeCode, rego, state), out var vehicleDetail);
        return vehicleDetail;
    }
}
