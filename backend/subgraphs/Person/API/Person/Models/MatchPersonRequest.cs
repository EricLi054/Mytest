namespace Person.API.Person.Models;

public class MatchPersonRequest
{
    public required string FirstName { get; set; }
    public required string DateOfBirth { get; set; }
    public required string Surname { get; set; }
    public string? MobilePhone { get; set; }
    public string? RacId { get; set; }
    public string? ProductNumber { get; set; }
}