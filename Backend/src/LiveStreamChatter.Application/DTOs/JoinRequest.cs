namespace LiveStreamChatter.Application.DTOs;

public class JoinRequest
{
    public string UserName { get; set; }
}

public class JoinResponse
{
    public string UserName { get; set; }
    public string UserId { get; set; }
    public string Token { get; set; }
}
