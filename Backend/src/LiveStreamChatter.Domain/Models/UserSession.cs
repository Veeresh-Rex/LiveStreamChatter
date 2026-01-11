namespace LiveStreamChatter.Domain.Models;

public class UserSession
{
    public string UserName { get; set; }
    public DateTimeOffset JoinedAt { get; set; }
}
