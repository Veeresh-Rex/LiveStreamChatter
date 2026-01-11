using LiveStreamChatter.Application.DTOs;

namespace LiveStreamChatter.Application.Interfaces;

public interface ILiveCommentServices
{
    Task<JoinResponse> JoinComments(JoinRequest joinRequest);
    Task PostComment(string token, string message);
}
