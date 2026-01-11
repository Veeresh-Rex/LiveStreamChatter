using LiveStreamChatter.Application.Interfaces;
using LiveStreamChatter.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Text.Json;

namespace LiveStreamChatter.Api.Controllers;

[ApiController]
[Route("api/sse")]
public class SseController : ControllerBase
{
    private readonly IRedisStreamService _redisStreamService;
    private readonly StreamManager _streamManager;

    public SseController(IRedisStreamService redisStreamService, StreamManager streamManager)
    {
        _redisStreamService = redisStreamService;
        _streamManager = streamManager;
    }

    [HttpGet("stream")]
    public async Task Stream([FromHeader(Name = "X-Token-Id")] string token, CancellationToken ct)
    {
        var userSession = await _redisStreamService.GetUserFromTokenAsync(token);
        if (userSession == null)
        {
            Response.StatusCode = 401;
            await Response.WriteAsync("Unauthorized", cancellationToken: ct);
            return;
        }

        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("Connection", "keep-alive");
        string connectionId = Guid.NewGuid().ToString();

        // Get the Reader for this specific connection
        var channelReader = _streamManager.JoinStream(connectionId);

        try
        {
            // Send an initial "Connected" message
            var welcome = new { Type = "System", Message = $"Connected as {userSession.UserName}" };
            await Response.WriteAsync($"data: {JsonSerializer.Serialize(welcome)}\n\n", ct);
            await Response.Body.FlushAsync(ct);

            // This loop keeps the connection open. It waits for data to appear in the channel.
            await foreach (var comment in channelReader.ReadAllAsync(ct))
            {
                await SendSseEventAsync(comment, ct);
            }
        }
        catch (OperationCanceledException)
        {
            // Client disconnected (closed tab), this is normal.
        }
        finally
        {
            // Remove user from the manager so we stop trying to send them messages
            _streamManager.LeaveStream(connectionId);
        }
    }

    private async Task SendSseEventAsync(object data, CancellationToken ct)
    {
        var json = JsonSerializer.Serialize(data);
        await Response.WriteAsync($"data: {json}\n\n", ct);
        await Response.Body.FlushAsync(ct);
    }
}
