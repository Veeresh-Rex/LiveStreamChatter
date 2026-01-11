namespace LiveStreamChatter.Domain.Models;

public class CommentMessage
{
    public string UserName { get; set; }
    public string Message { get; set; }
    public DateTimeOffset Timestamp { get; set; }
}
