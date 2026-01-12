using LiveStreamChatter.Domain.Models;
using System.Collections.Concurrent;
using System.Threading.Channels;

namespace LiveStreamChatter.Application.Services;

public class StreamManager
{
    // Dictionary to hold all active connections on THIS server
    // Key: Connection ID, Value: The ChannelWriter to send data to that specific HTTP response
    private readonly ConcurrentDictionary<string, ChannelWriter<CommentMessage>> _clients = new();

    // 1. User Connects: We give them a "Mailbox" (Channel)
    public ChannelReader<CommentMessage> JoinStream(string connectionId)
    {
        // Create a dedicated channel for this specific user
        var channel = Channel.CreateUnbounded<CommentMessage>();

        // Store the writer so we can send messages to them later
        _clients.TryAdd(connectionId, channel.Writer);

        return channel.Reader;
    }

    // 2. User Disconnects
    public void LeaveStream(string connectionId)
    {
        _clients.TryRemove(connectionId, out var writer);

        // Try to close the writer to free resources
        writer?.TryComplete();
    }

    // 3. Send Message to ALL connected users on this server
    public async Task BroadcastToLocalClientsAsync(CommentMessage comment)
    {
        foreach (var client in _clients)
        {
            // Write the message to the user's private channel
            await client.Value.WriteAsync(comment);
        }
    }
}
