using LiveStreamChatter.Application.Interfaces;
using LiveStreamChatter.Application.Services;
using LiveStreamChatter.Infrastructure.BackgroundServices;
using LiveStreamChatter.Infrastructure.Redis;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    return ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis")!);
});

builder.Services.AddSingleton<IRedisStreamService, RedisStreamService>();
builder.Services.AddScoped<ILiveCommentServices, LiveCommentServices>();
builder.Services.AddSingleton<StreamManager>();
builder.Services.AddSingleton<CommentService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<CommentService>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
