using LiveStreamChatter.Application.Interfaces;
using LiveStreamChatter.Domain.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace LiveStreamChatter.Infrastructure.Redis;

public class RedisStreamService : IRedisStreamService
{
    private const string REDIS_CHANNEL = "live_stream_comments";
    private const string PREFIX_SESSION = "user_session:";
    private static readonly TimeSpan SessionTtl = TimeSpan.FromHours(2);
    private readonly IConnectionMultiplexer _redis;

    public RedisStreamService(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }
    public async Task<UserSession?> GetUserFromTokenAsync(string token)
    {
        var db = _redis.GetDatabase();
        var json = await db.StringGetAsync($"{PREFIX_SESSION}{token}");

        if (!json.HasValue) { return null; }

        return JsonSerializer.Deserialize<UserSession>(json.ToString())!;
    }

    public async Task PublishCommentAsync(CommentMessage comment)
    {
        var sub = _redis.GetSubscriber();
        string json = JsonSerializer.Serialize(comment);
        await sub.PublishAsync(REDIS_CHANNEL, json, CommandFlags.FireAndForget);
    }

    public async Task SaveUserSessionAsync(string token, UserSession session)
    {
        var db = _redis.GetDatabase();
        string json = JsonSerializer.Serialize(session);

        // Save session with 2 Hour Expiration
        await db.StringSetAsync($"{PREFIX_SESSION}{token}", json, SessionTtl);
    }

    public async Task SubscribeToCommentsAsync(Action<CommentMessage> onMessageReceived)
    {
        var sub = _redis.GetSubscriber();
        await sub.SubscribeAsync(REDIS_CHANNEL, (channel, message) =>
        {
            if (message.HasValue)
            {
                var comment = JsonSerializer.Deserialize<CommentMessage>(message.ToString());
                if (comment != null) onMessageReceived(comment);
            }
        });
    }
}
