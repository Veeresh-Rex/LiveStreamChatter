using LiveStreamChatter.Domain.Models;

namespace LiveStreamChatter.Application.Interfaces;

public interface IRedisStreamService
{
    Task SaveUserSessionAsync(string token, UserSession session);
    Task<UserSession?> GetUserFromTokenAsync(string token);
    Task PublishCommentAsync(CommentMessage comment);
    Task SubscribeToCommentsAsync(Action<CommentMessage> onMessageReceived);
}
