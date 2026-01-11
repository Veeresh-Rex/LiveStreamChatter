using LiveStreamChatter.Application.Interfaces;
using LiveStreamChatter.Domain.Models;
using Microsoft.Extensions.Hosting;
using System.Threading.Channels;
using LiveStreamChatter.Application.Services;

namespace LiveStreamChatter.Infrastructure.BackgroundServices;

public class CommentService : IHostedService
{
    private readonly IRedisStreamService _redisService;
    private readonly StreamManager _streamManager;
    private readonly Channel<CommentMessage> _localChannel;

    public CommentService(IRedisStreamService redisStreamService, StreamManager streamManager)
    {
        _redisService = redisStreamService;
        _streamManager = streamManager;
        _localChannel = Channel.CreateUnbounded<CommentMessage>();
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // Subscribe to Redis
        await _redisService.SubscribeToCommentsAsync(async (comment) =>
        {
            try 
            {
                // When we get a message from Redis, we broadcast it to all local SSE clients
                await _streamManager.BroadcastToLocalClientsAsync(comment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error broadcasting comment: {ex.Message}");
            }
        });
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
