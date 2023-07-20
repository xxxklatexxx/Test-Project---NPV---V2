using System.Diagnostics.CodeAnalysis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyHeader()
           .AllowAnyMethod();
});

app.UseHttpsRedirection();
app.MapPost("/calculatenpv", (RequestModel request) =>
{
    try
    {
        if (request.Lower > request.Upper) return Results.BadRequest();

        var npvResults = new List<ResultModel>();

        for (double rate = request.Lower; rate <= request.Upper; rate += request.RateIncrement)
        {
            double npv = request.CashFlows.Select((value, index) => value / Math.Pow(1 + (rate / 100), index + 1)).Sum();

            npvResults.Add(new ResultModel() { Npv = npv - request.InitialInvestment, Rate = rate });
        }

        return Results.Ok(npvResults);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(ex.Message);
    }
   
})
.WithName("CalculateNpv")
.WithOpenApi();



app.Run();


public partial class Program { }