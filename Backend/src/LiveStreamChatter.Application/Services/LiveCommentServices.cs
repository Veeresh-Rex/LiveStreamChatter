using LiveStreamChatter.Application.DTOs;
using LiveStreamChatter.Application.Interfaces;
using LiveStreamChatter.Domain.Models;

namespace LiveStreamChatter.Application.Services;

public class LiveCommentServices : ILiveCommentServices
{
    private readonly IRedisStreamService _redisStreamService;

    public LiveCommentServices(IRedisStreamService redisStreamService)
    {
        _redisStreamService = redisStreamService;
    }

    public async Task<JoinResponse> JoinComments(JoinRequest joinRequest)
    {
        if (string.IsNullOrWhiteSpace(joinRequest.UserName))
        {
            throw new ArgumentException("Username cannot be empty.");
        }

        string userId = Guid.NewGuid().ToString(); // Unique ID for logic
        string token = Guid.NewGuid().ToString();  // Secret token for API calls

        UserSession session = new UserSession
        {
            UserName = joinRequest.UserName,
            JoinedAt = DateTimeOffset.UtcNow
        };

        await _redisStreamService.SaveUserSessionAsync(token, session);

        return new JoinResponse
        {
            UserName = joinRequest.UserName,
            UserId = userId,
            Token = token
        };
    }

    public async Task PostComment(string token, string message)
    {
        var userSession = await _redisStreamService.GetUserFromTokenAsync(token);
        if (userSession == null)
        {
            throw new UnauthorizedAccessException("Invalid token.");
        }
        CommentMessage comment = new CommentMessage
        {
            UserName = userSession.UserName,
            Message = message,
            Timestamp = DateTimeOffset.UtcNow
        };
        await _redisStreamService.PublishCommentAsync(comment);
    }
}
