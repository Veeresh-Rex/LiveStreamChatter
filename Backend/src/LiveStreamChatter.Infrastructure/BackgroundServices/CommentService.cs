using LiveStreamChatter.Application.Interfaces;
using LiveStreamChatter.Domain.Models;
using Microsoft.Extensions.Hosting;
using System.Threading.Channels;

namespace LiveStreamChatter.Infrastructure.BackgroundServices;

public class CommentService : IHostedService
{
    private readonly IRedisStreamService _redisService;
    private readonly Channel<CommentMessage> _localChannel;
    public CommentService(IRedisStreamService redisStreamService)
    {
        _redisService = redisStreamService;
        _localChannel = Channel.CreateUnbounded<CommentMessage>();
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // We simply tell the Redis Service: 
        // "When a message comes, write it to my local channel"
        await _redisService.SubscribeToCommentsAsync((comment) =>
        {
            _localChannel.Writer.TryWrite(comment);
        });
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
