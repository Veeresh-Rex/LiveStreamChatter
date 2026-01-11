using LiveStreamChatter.Application.DTOs;
using LiveStreamChatter.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LiveStreamChatter.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LiveCommentController : ControllerBase
{
    private readonly ILiveCommentServices _liveCommentServices;

    public LiveCommentController(ILiveCommentServices liveCommentServices)
    {
        _liveCommentServices = liveCommentServices;
    }

    [HttpPost("join")]
    public async Task<ActionResult<JoinResponse>> join([FromBody] JoinRequest joinRequest)
    {
        var result = await _liveCommentServices.JoinComments(joinRequest);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> PostComment([FromHeader (Name = "X-Token-Id")] string token, [FromBody] CommentRequest message)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return Unauthorized("Token is required.");
        }

        await _liveCommentServices.PostComment(token, message.Message);
        return Ok(new { Message = "Your comment posted" });
    }
}
